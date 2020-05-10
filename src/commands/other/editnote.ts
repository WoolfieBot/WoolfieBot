import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";

class Editnote extends Command {
    constructor(){
        super({
            name: "editnote",
            usage: ">editnote {Название записки} {Изменённое содержимое}",
            description: "Команда которая изменяет ваши записки.",
            category: "other",
            aliases: ["edn","enote"]
        });
    }
    
    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        if(!args[1]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)

        let noteName: Array<RegExpMatchArray> = Array.from(args.slice(0).join(" ").matchAll(/{(.*?)}/))
        if(await client.provider.getUserNote(message.guild!.id, message.author.id, noteName[0][1]) !== null){     
            let note: string = args.slice(0).join(" ").replace(noteName[0][0], "")
            if(await client.provider.editNote(message.guild!.id, noteName[0][1], note)){
                message.channel.send(`Записка успешно изменена!`)
            }else{
                message.channel.send(`При редактировании записки произошла ошибка!`)
            }
        }else{
            message.channel.send('У тебя нет такой зписки!')
        }
    }
}

export = Editnote;