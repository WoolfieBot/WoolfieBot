import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import {playerSessions} from "../../domain/PlayerHelper";
  
class Skip extends Command {
    constructor(){
        super({
            name: "skip",
            description: "Команда с помощью которой можно пропускать играющие треки.",
            category: "fun",
            usage: ">skip"
        });
    }

    async run(message: Message, args: string[], cmd: string) {
        const session = playerSessions.get(message.guild?.id);
        if(!session) return message.channel.send('На данный момент нет активных сессий плеера на этом сервере!');

        if(message.member?.voice.channelID !== session.connection.voice.channelID) return message.channel.send('Вы должны находится в одном канале с ботом!');

        await message.channel.send('Вы пропустили песню.');
        session.dispatcher.emit('finish');
    }
}

export = Skip;