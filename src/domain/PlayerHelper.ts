import { VoiceConnection, StreamDispatcher, Message, MessageEmbed, TextChannel } from "discord.js";
import sequelize from "../models/sequelize";
import search from "yt-search";
import { WoolfieClient } from "./WoolfieClient";
import ytdl from "ytdl-core";
import HumanizeDuration from "humanize-duration";
const playerSessions = new Map();

class PlayerHelper {
    guildID: string;

    constructor(guildID: string) {
        this.guildID = guildID;
    }

    public getSession() {
        return playerSessions.get(this.guildID);
    }

    public createSession(voiceConnection: VoiceConnection, streamDispatcher: StreamDispatcher, queue: Array<{songTitle: string, requester: string, url: string, announceChannel: string, duration: number, thumb: { url: string, height: number, width: number }}>) {
        playerSessions.set(this.guildID, {
            guildID: this.guildID,
            connection: voiceConnection,
            queue: queue,
            dispatcher: streamDispatcher
        })
        return this.getSession();
    }

    public next(): Array<{songTitle: string, requester: string, url: string, announceChannel: string, duration: number, thumb: { url: string, height: number, width: number }}> | null {
        if(playerSessions.get(this.guildID).queue.length < 1) return null;
        let data = playerSessions.get(this.guildID);
        data.queue.shift();
        playerSessions.set(this.guildID, data);
        return this.getSession().queue;
    }

    public add(info: object): Array<{songTitle: string, requester: string, url: string, announceChannel: string, duration: number, thumb: { url: string, height: number, width: number }}> | null {
        let data = this.getSession();
        data.queue.push(info);
        playerSessions.set(this.guildID, data);
        return this.getSession().queue;
    }

    public deleteSession() {
        playerSessions.delete(this.guildID)
    }

    public async search(arg: string, message: Message) {
        let video: search.VideoSearchResult[] = [];

        let r = await search({
            query: arg,
            pageStart: 1,
            pageEnd: 1
        });

        let count = 0;

        while(r.videos.length < 1) {

            r = await search({
                query: arg,
                pageStart: 1,
                pageEnd: 1
            })

            count++;

            if(count >= 20){
                message.channel.send('Произошла ошибка при поиске! Попробуйте вставить ссылку.')
                return video;
            }

        }
        let string = "";
        r.videos = r.videos.slice(0, 10)
        r.videos.forEach((x, i) => {
            string += `#${i + 1} [${x.title}](${x.url}) | ${HumanizeDuration(x.duration.seconds * 1000, {language: 'ru', delimiter: ' ', largest: 2, round: true})} | ${x.author.channelName || x.author.name}\n`
        })
        const filter = (m: Message) => /[0-9]/.test(m.content) && m.author == message.author;

        message.channel.send(
            new MessageEmbed()
                .setDescription(string)
                .setFooter("Введите в чат число от 1 до 10 что бы выбрать песню.")
                .setTitle('Результаты поиска')
        );

        await message.channel.awaitMessages(filter,
            {
                max: 1,
                time: 60000,
                errors: ['time']
            })
        .then(collected => {video.push(r.videos[parseInt(collected.first()!.content) - 1])})
        .catch(collected => message.channel.send('Время выбора истекло.'));
        return video;
    }

    public async getPlaylist(name: string, guildID: string, userID?: string) {
        let data;
        if(userID) {
            data = await sequelize.models.playlists.findAll({where:{name: name, guildID: guildID, userID: userID}});
        } else {
            data = await sequelize.models.playlists.findAll({where:{name: name, guildID: guildID}});
        }
        return data;
    }

    public async addPlaylist(name: string, userID: string, guildID: string, title: string, url: string, duration: string, author: string, thumb: { url: string, height: number, width: number }) {
        await sequelize.models.playlists.create({name: name, guildID: guildID,userID: userID, title: title, url: url, duration: duration, author: author, thumb: thumb.url, height: thumb.height, width: thumb.width})
    }

    public async removeFromPlaylist(name: string, userID: string, url: string) {
        await sequelize.models.playlists.destroy({where:{name: name, userID: userID, url: url}})
    }

    public async deletePlaylist(name: string, userID: string) {
        await sequelize.models.playlists.destroy({where:{name: name, userID: userID}})
    }

    public async play(client: WoolfieClient, voiceConnection: VoiceConnection, player: PlayerHelper, queue: Array<{songTitle: string, requester: string, url: string, announceChannel: string, duration: number, thumb: { url: string, height: number, width: number }}>): Promise<StreamDispatcher> {
        const channel = <TextChannel>client.channels.cache.get(queue[0].announceChannel);
        channel.send(
            new MessageEmbed()
                .setImage(queue[0].thumb.url)
                .setTitle(':play_pause: Сейчас проигрывается')
                .setDescription(`**[${queue[0].songTitle}](${queue[0].url})**\n\nЗаказано: ${queue[0].requester}\n\n${player.msToTime(queue[0].duration * 1000)}`)
                .setFooter('Общее колличество треков в плейлисте: ' + queue.length)
        );
        let dispatcher: StreamDispatcher = await voiceConnection.play(
            await ytdl(queue[0].url,
            {
                filter: "audioonly",
                highWaterMark: 1<<20 
            }
            ),
            {
                highWaterMark : 1<<20,
                fec : false 
            }
        );
        await client.provider.sleep(5000);
        this.deleteSession()
        this.createSession(voiceConnection, dispatcher, queue)
    
        dispatcher.on('finish', function(this: any) {
            player.end(client, this.player.voiceConnection.channel.guild.id, player);
        });

        dispatcher.on('error', (err) => {
            console.log(err)
        })

        dispatcher.on('debug', (debug) => {
            console.log(debug)
        })

        dispatcher.on('close', function(this: any) {
            console.log('epta')
            player.end(client, this.voiceConnection.channel.guild.id, player);
        })

        return dispatcher;
    }
    
    public async end(client: WoolfieClient, guildID: string, player: PlayerHelper) {
        let session = player.getSession();
        let fetched = player.next();

        if (fetched!.length > 0) {
            this.play(client, session.connection, player, fetched !== null ? fetched : []);
        } else {
            player.deleteSession();
            let vc = client.guilds.cache.get(guildID)?.me?.voice.channel;
            if (vc) vc.leave();
        }
    }

    public msToTime(duration: number) {
        let seconds: number | string = Math.round((duration / 1000) % 60);
        let minutes: number | string = Math.round((duration / (1000 * 60)) % 60);
        let hours: number | string = Math.round((duration / (1000 * 60 * 60)) % 24);
      
        hours = (hours < 10) ? "0" + hours.toString() : hours.toString();
        minutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
        seconds = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();
      
        return hours + ":" + minutes + ":" + seconds 
    }
}

export { PlayerHelper };