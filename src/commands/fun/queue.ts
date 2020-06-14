import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { PlayerHelper } from "../../domain/PlayerHelper";
import { client } from "../../main";
import HumanizeDuration from "humanize-duration";
import ytdl from "ytdl-core";
  
class Queue extends Command {
    constructor(){
        super({
            name: "queue",
            description: "Команда с помощью которой можно посмотреть текущий плейлист сессии плеера.",
            category: "fun",
            usage: ">queue"
        });
    }

    async run(message: Message, args: string[], cmd: string) {
        const player = new PlayerHelper(message.guild!.id);
        const session = player.getSession();
        if(!session) return message.channel.send('На данный момент нет активных сессий плеера на этом сервере!');
        if(message.member?.voice.channelID !== session.connection.voice.channelID) return message.channel.send('Вы должны находится в одном канале с ботом!');
        let string: string = ""; 
        let duration: number = 0;
        let info = await ytdl.getInfo(session.queue[0].url);
        let thumb = info.player_response.videoDetails.thumbnail.thumbnails;
        session.queue.slice(1).forEach((element: any, int: number) => {
            duration += parseInt(element.duration + session.queue[0].url);
            string += `#${int + 1} | [${element.songTitle}](${element.url}) | Заказано: ${element.requester}\n`
        });
        let progress = Math.floor((22 * session.dispatcher.streamTime) / (session.queue[0].duration * 1000));
        let progressString = "";
        for (let i = 0; i < 22; i++) {
            if(i + 1 <= progress) {
                if(progress == i + 1) {
                    progressString += "<:point:721508030101061682>"
                }else{
                    progressString += "<:blue:721506245298618369>"
                }
            } else {
                progressString += "<:white:721507303999930450>"
            }
        }
        await message.channel.send(
            new MessageEmbed()
                .setImage(thumb[thumb.length - 1].url)
                .setTitle('Сейчас проигрывается')
                .setDescription(`**[${session.queue[0].songTitle}](${session.queue[0].url})**\n\nЗаказано: ${session.queue[0].requester}\n\n${progressString}\n\n${player.msToTime(session.dispatcher.streamTime)} / ${player.msToTime(session.queue[0].duration * 1000)}`)
        )
        if(session.queue.length > 1) {
            message.channel.send(
                new MessageEmbed()
                    .setDescription(string)
                    .setAuthor('Очередь')
                    .setFooter('Общая продолжительность: ' + HumanizeDuration(duration * 1000, {language: 'ru', delimiter: ' ', largest: 2, round: true}))
            )
        }
    }
}

export = Queue;