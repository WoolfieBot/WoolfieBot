import { Command } from "../../domain/Command";
import { Message, GuildMember } from "discord.js";
import { client } from "../../main";

class Note extends Command {
    constructor(){
        super({
            name: "note",
            usage: ">note {название записки}, >note all, >note all {упоминание пользователя}",
            description: "Команда которая выдает конкретную записку, все записки сервера и все записки пользователя.",
            category: "fun",
            aliases: ["n","nt"]
        });
    }
    
    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help note\`\`\``)
        if(args[0] === "all" && !args[1]){
            let string: string = "";
            let data: any = await client.provider.getAllNotes(message.guild!.id)
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element = data[key];
                    string += `${element.noteName}, `
                }
            }
            return message.channel.send(`Все записки для сервера **${message.guild?.name}**: ${string}`)
        }
        if(args[0] === "all" && args[1]){
            let string: string = "";
            let member: any = await client.provider.getMember(message, args[1])
            let data: any = await client.provider.getAllUsersNote(message.guild!.id,member.user.id)
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element = data[key];
                    string += `${element.noteName}, `
                }
            }
            if(string.length == 0){
                return message.channel.send(`У данного пользователя еще нет записок!`)
            }
            return message.channel.send(`Все записки пользователя **${member.nickname}**: ${string}`)
        }
        let data: any = await client.provider.getNote(message.guild!.id, args[0])
        if(data){
            message.channel.send(data.note)
        }else{
            message.channel.send(`Такой записки не существует`)
        }
    }
}

export = Note;