import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";

class Editnote extends Command {
    constructor(){
        super({
            name: "editnote",
            usage: ">editnote {Название записки} {Изменённое содержимое}",
            description: "Команда которая изменяет ваши записки.",
            category: "fun",
            aliases: ["edn","enote"]
        });
    }
    
    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help editnote\`\`\``)
        if(!args[1]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help editnote\`\`\``)

        if(await client.provider.getUserNote(message.guild!.id, message.author.id, args[0]) !== null){
            let string: string = args.slice(1).join(" ")
            if(await client.provider.editNote(message.guild!.id,args[0],string) == true){
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