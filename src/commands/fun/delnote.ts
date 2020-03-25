import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";

class DelNote extends Command {
    constructor(){
        super({
            name: "delnote",
            usage: ">delnote [название записки]",
            description: "Команда удаляющая вашу записку.",
            category: "fun",
            aliases: ["dn","deln"]  
        });
    }
    
    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)

        if(await client.provider.getUserNote(message.guild!.id, message.author.id, args.slice(0).join(" ")) !== null){
            if(await client.provider.deleteNote(message.guild!.id,args.slice(0).join(" ")) == true){
                message.channel.send(`Записка успешно удалена!`)
            }else{
                message.channel.send(`При удалении записки произошла ошибка!`)
            }
        }else{
            message.channel.send('У тебя нет такой зписки!')
        }
    }
}

export = DelNote;