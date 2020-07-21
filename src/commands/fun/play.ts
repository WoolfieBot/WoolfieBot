import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import ytdl from "ytdl-core";
import { client } from "../../main";
import { PlayerHelper } from "../../domain/PlayerHelper";
import search from "yt-search";

class Play extends Command {
    constructor(){
        super({
            name: "play",
            description: "Команда для прослушивания видеороликов на YouTube.",
            category: "fun",
            usage: ">play [Ссылка на видеоролик или ключевые слова для поиска]"
        });
    }

    async run(message: Message, args: string[], cmd: string) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        
        if (!message.member?.voice.channel) return message.channel.send('Вы должны быть в голосовом канале.');
        let info;
        let video: search.VideoSearchResult[] = [];

        let validate = await ytdl.validateURL(args[0]);
        const player = new PlayerHelper(message.guild!.id);

        if (!validate) {
            video = await player.search(args.join(" "), message);
            if(video.length <= 0) return;
            info = await ytdl.getInfo(video[0].url);
        } else {
            info = await ytdl.getInfo(args[0]);
        }
        let thumb = info.player_response.videoDetails.thumbnail.thumbnails;
        
        let data = player.getSession();

        if(!data) {
            let queue = [{
                songTitle: info.title,
                requester: `<@${message.author.id}>`,
                url: video.length > 0 ? video[0].url : args[0],
                announceChannel: message.channel.id,
                duration: parseInt(info.length_seconds),
                thumb: {
                    url: thumb[thumb.length - 1].url,
                    height: thumb[thumb.length - 1].height,
                    width: thumb[thumb.length - 1].width 
                }
            }];
            let voiceConnection = await message.member?.voice.channel.join();
            let dispatcher = await player.play(client, voiceConnection, player, queue);
            data = player.createSession(voiceConnection, dispatcher, queue);
        } else {
            player.add({
                songTitle: info.title,
                requester: `<@${message.author.id}>`,
                url: video.length > 0 ? video[0].url : args[0],
                announceChannel: message.channel.id,
                duration: info.length_seconds,
                thumb: {
                    url: thumb[thumb.length - 1].url,
                    height: thumb[thumb.length - 1].height,
                    width: thumb[thumb.length - 1].width 
                }
            });
        }

        if (data.queue.length > 1)
        {
            await message.channel.send(new MessageEmbed().setImage(thumb[thumb.length - 1].url).setTitle('⬆️ Очередь').setDescription(`Трек:\n**[${info.title}](${info.video_url})**\n\nБыл добавлен в очередь пользователем:\n**${message.member.displayName || message.author.username}**\n\n${player.msToTime(parseInt(info.length_seconds) * 1000)}`).setFooter('Общее количество треков в плейлисте: ' + player.getSession().queue.length))
        }

    }
}

export = Play;