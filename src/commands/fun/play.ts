import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import ytdl from "ytdl-core";
import { client } from "../../main";
import { WoolfieClient } from "../../domain/WoolfieClient";

class Play extends Command {
    constructor(){
        super({
            name: "play",
            description: "Команда с помощью которой можно увидеть аватар пользователя!",
            category: "fun",
            usage: ">avatar [Упоминание или ник пользователя]"
        });
    }

    async run(message: Message, args: string[], cmd: string, ops: any) {
        if (!message.member?.voice.channel) return message.channel.send('Вы должны быть в голосовом канале.')

        if (!args[0]) return message.channel.send('Сначала укажите ссылку для проигрывания.');

        try{

        let validate = await ytdl.validateURL(args[0]);

        if (!validate) {

            let commandFile = require(`./search.js`);
            return commandFile.run(client, message, args, ops).catch(console.error);

        }
    } catch(err) {
        return console.log(err)
    }
    let data = ops.get(message.guild!.id) || {};
    try {
        let info = await ytdl.getInfo(args[0])
        if (!data.connection) data.connection = await message.member?.voice.channel.join();
        if (!data.queue) data.queue = [];
        data.guildID = message.guild!.id;

        data.queue.push({
            songTitle: info.title,
            requester: message.author.tag,
            url: args[0],
            announceChannel: message.channel.id
        });
    
        if (!data.dispatcher) play(client, ops, data)
        else {
            message.channel.send(`Добавлено в очередь: ${info.title} | Заказано: ${message.author.tag}`)
        }

        ops.set(message.guild!.id, data)

        async function play(client: WoolfieClient, ops: any, data: any) {
            //@ts-ignore
            client.channels.cache.get(data.queue[0].announceChannel).send(`Сейчас проигрывается: ${data.queue[0].songTitle} | Заказано: ${data.queue[0].requester}`);
        
            data.dispatcher = await data.connection.play(ytdl(data.queue[0].url, { filter: 'audioonly' }));
            data.dispatcher.guildID = data.guildID;
        
            data.dispatcher.once('end', function(this: any) {
                end(client, ops, this);
            });
        }
        function end(client: any, ops: any, dispatcher: any) {

            let fetched = ops.get(dispatcher.guildID);
        
            fetched.queue.shift();
        
            if (fetched.queue.length > 0) {
                
                ops.set(dispatcher.guildID, fetched);
        
                play(client, ops, fetched);
        
            } else {
                
                ops.delete(dispatcher.guildID);
        
                let vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;
                if (vc) vc.leave();
            }
        }
        

    }
catch(err){

    message.channel.send(`Произошла ошибка ${err}`)

}
    }
}

export = Play;