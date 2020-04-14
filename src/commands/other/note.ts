import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";
import { NoteObject } from "../../domain/ObjectModels";

class Note extends Command {
    constructor(){
        super({
            name: "note",
            usage: ">note {название записки}, >note all, >note all {упоминание пользователя}",
            description: "Команда которая выдает конкретную записку, все записки сервера и все записки пользователя.",
            category: "other",
            aliases: ["n","nt"]
        });
    }
    
    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)

        if(args[0] === "all" && !args[1]){
            let string: string = "";
            let data: Array<NoteObject> = await client.provider.getAllNotes(message.guild!.id)
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element: NoteObject = data[key];
                    string += `${element.noteName}, `
                }
            }
            if(string.length == 0){
                return message.channel.send(`На данном сервере еще нет записок! Станьте первым кто напишет её!\nСправка по созданию \`>help addnote\``)
            }
            return message.channel.send(`Все записки для сервера **${message.guild?.name}**: ${string}`)
        }
        if(args[0] === "all" && args[1]){
            let string: string = "";
            let member: any = await client.provider.getMember(message, args.slice(1).join(" "))
            let data: Array<NoteObject> = await client.provider.getAllUsersNote(message.guild!.id,member.user.id)
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element: NoteObject = data[key];
                    string += `${element.noteName}, `
                }
            }
            if(string.length == 0){
                return message.channel.send(`У данного пользователя еще нет записок!`)
            }
            return message.channel.send(`Все записки пользователя **${member.nickname}**: ${string}`)
        }
        let data: NoteObject = await client.provider.getNote(message.guild!.id, args.slice(0).join(" "))
        if(data){
            message.channel.send(data.note)
        }else{
            message.channel.send(`Такой записки не существует`)
        }
    }
}

export = Note;