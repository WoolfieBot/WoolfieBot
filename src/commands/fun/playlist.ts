import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { PlayerHelper } from "../../domain/PlayerHelper";
import { client } from "../../main";
import ytdl from "ytdl-core";
import search from "yt-search";
import Play from "./play";
import HumanizeDuration from "humanize-duration";
  
class Playlist extends Command {
    constructor(){
        super({
            name: "playlist",
            description: "Команда с помощью которой можно пропускать играющие треки.",
            category: "fun",
            usage: ">skip"
        });
    }

    async run(message: Message, args: string[], cmd: string) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)

        const player = new PlayerHelper(message.guild!.id);
        let validate;
        let video: search.VideoSearchResult[];
        let info;
        let playlist;
        let thumb: ytdl.thumbnail[];

        switch(args[0]) {
            case "create":
                if(!args[1]) return message.channel.send('Укажите название плейлиста!')
                const filter = (m: Message) => m.author == message.author;
                message.channel.send("Отлично! Теперь введите ссылку или название первой песни в вашем плейлисте.");
                let arg = await (await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })).first()?.content;
                validate = ytdl.validateURL(<string>arg);
                video = [];
                if (!validate) {
                    video = await player.search(<string>arg, message);
                    if(video.length <= 0) return;
                    info = await ytdl.getInfo(video[0].url);
                } else {
                    info = await ytdl.getInfo(<string>arg);
                }
                thumb = info.player_response.videoDetails.thumbnail.thumbnails;
                await player.addPlaylist(
                    args[1], 
                    message.author.id, 
                    message.guild!.id,
                    info.title, 
                    video.length > 0 ? video[0].url : <string>arg,
                    video.length > 0 ? video[0].duration.seconds : (info.length_seconds.toString() as any), 
                    video.length > 0 ? video[0].author.channelName || video[0].author.name : info.author.name || info.author.user,
                    {
                        url: thumb[thumb.length - 1].url,
                        height: thumb[thumb.length - 1].height,
                        width: thumb[thumb.length - 1].width
                    }
                );
                await message.channel.send('Плейлист успешно создан!');
                break;
            case "show":
                if(!args[1]) return message.channel.send('Укажите название плейлиста!')
                playlist = await player.getPlaylist(args.slice(1).join(), message.guild!.id);
                if(playlist.length < 1) return message.channel.send('Такого плейлиста не существует, или он не пренадлежит вам!');
                let creator = client.users.cache.get(playlist[0].userID)?.username;
                let string: string = "";
                let duration: number = 0;
                playlist.forEach((x: any, int: number) => {
                    duration += parseInt(x.duration);
                    string += `#${int + 1} | [${x.title}](${x.url}) | ${x.author}\n`
                });
                await message.channel.send(new MessageEmbed().setDescription(string).setTitle('Просмотр плейлиста ' + args.slice(1).join()).setFooter('Общая продолжительность плейлиста: ' + HumanizeDuration(duration * 1000, {language: 'ru', delimiter: ' ', largest: 2, round: true}) + ' | Автор: ' + creator));
                break;
            case "add":
                if(!args[1]) return message.channel.send('Укажите название плейлиста!')
                if(!args[2]) return message.channel.send('Укажите ссылку или название песни!')
                playlist = await player.getPlaylist(args[1], message.guild!.id, message.author.id);
                if(playlist.length == 0) return message.channel.send('Такого плейлиста не существует, или он не пренадлежит вам!')
                validate = ytdl.validateURL(args.slice(2).join());
                video = [];
                if (!validate) {
                    video = await player.search(args.slice(2).join(), message);
                    if(video.length <= 0) return;
                    info = await ytdl.getInfo(video[0].url);
                } else {
                    info = await ytdl.getInfo(args.slice(2).join());
                }
                thumb = info.player_response.videoDetails.thumbnail.thumbnails;
                await player.addPlaylist(
                    args[1],
                    message.author.id,
                    message.guild!.id,
                    info.title, 
                    video.length > 0 ? video[0].url : args.slice(2).join(),
                    video.length > 0 ? video[0].duration.seconds : (info.length_seconds.toString() as any), 
                    video.length > 0 ? video[0].author.channelName || video[0].author.name : info.author.name || info.author.user,
                    {
                        url: thumb[thumb.length - 1].url,
                        height: thumb[thumb.length - 1].height,
                        width: thumb[thumb.length - 1].width 
                    }
                );
                await message.channel.send('Трек успешно добавлен в плейлист!');
                break;
            case "play":
                if(!args[1]) return message.channel.send('Укажите название плейлиста!')
                playlist = await player.getPlaylist(args.slice(1).join(), message.guild!.id);
                if(playlist.length < 1) return message.channel.send('Такого плейлиста не существует!');
                if(!message.member?.voice.channel) return message.channel.send('Вы должны быть в голосовом канале.');
                let queue: { songTitle: string; requester: string; url: string; announceChannel: string; duration: number, thumb: { url: string, height: number, width: number }}[] = [];
                playlist.forEach((x: any) => {
                    queue.push({
                        songTitle: x.title,
                        requester: message.author.tag,
                        url: x.url,
                        announceChannel: message.channel.id,
                        duration: parseInt(x.duration),
                        thumb: {
                            url: x.thumb,
                            height: x.height,
                            width: x.width 
                        }
                    })
                });
                let voiceConnection = await message.member.voice.channel?.join();
                let dispatcher = await player.play(client, voiceConnection, player, queue);
                player.createSession(voiceConnection, dispatcher, queue);
                break;
            case "remove":
                if(!args[1]) return message.channel.send('Укажите название плейлиста!')
                playlist = await player.getPlaylist(args[1], message.guild!.id, message.author.id);
                if(playlist.length < 1) return message.channel.send('Такого плейлиста не существует, или он не пренадлежит вам!');
                let res = "";
                playlist.forEach((x: any, int: number) => {
                    res += `#${int + 1} | [${x.title}](${x.url}) | ${x.author}\n`
                });
                await message.channel.send(new MessageEmbed().setDescription(res).setTitle('Просмотр плейлиста ' + args.slice(1).join()).setFooter('Введите цифру от 1 до ' + playlist.length));
                const filterr = (m: Message) => /[0-9]/.test(m.content) && m.author == message.author;

                let pick = await (await message.channel.awaitMessages(filterr, { max: 1, time: 60000, errors: ['time'] })).first()?.content;
                let song = playlist[parseInt(<string>pick) - 1];
                await player.removeFromPlaylist(args[1], message.author.id, song.url);
                message.channel.send('Вы успешно удалили трек из плейлиста!')
                break;
            default:
                return message.channel.send('Вы ввели неправильный аргумент! Проверьте правильность написания команды.')
        }
    }
}

export = Playlist;