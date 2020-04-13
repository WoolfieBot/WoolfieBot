import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";

class AddNote extends Command {
    constructor(){
        super({
            name: "addnote",
            usage: ">addnote [{название записки}] [содержимое записки]",
            description: "Команда создающая записку.",
            category: "fun",
            aliases: ["an","addn"]
        });
    }
    
    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        if(!args[1]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        if(await client.provider.getNote(message.guild!.id, args[0]) !== null) return message.channel.send(`Такая записка уже существует!`)
        let noteName: Array<RegExpMatchArray> = Array.from(args.slice(0).join(" ").matchAll(/{(.*?)}/))
        if(noteName.length !== 0){
            let note: string = args.slice(0).join(" ").replace(noteName[0][0], "")
            if(await client.provider.createNote(message.guild!.id, noteName[0][1], note, message.author.id) == true){
                return message.channel.send(`Записка ${noteName[0][1]} успешно создана!`)
            }else{
               return message.channel.send(`Произошла ошибка при создании записки.`)
            }
        }else{     
        if(await client.provider.createNote(message.guild!.id, args[0], args.slice(1).join(' '), message.author.id) == true){
            return message.channel.send(`Записка ${args[0]} успешно создана!`)
        }else{
           return message.channel.send(`Произошла ошибка при создании записки.`)
        }
    }
    }
}

export = AddNote;