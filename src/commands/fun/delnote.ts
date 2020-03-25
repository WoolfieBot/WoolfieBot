import { Command } from "../../domain/Command";
import { Message } from "discord.js";

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
    }
}

export = DelNote;