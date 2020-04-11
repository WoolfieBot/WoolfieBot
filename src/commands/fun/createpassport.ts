import { Command } from "../../domain/Command";
import { Message } from "discord.js";

class CreatePass extends Command {
    constructor(){
        super({
            name: "createpass",
            description: "Введите данную команду что бы получить бонус в виде монет! Можно получить только раз в 12 часов.",
            aliases: [""],
            category: "fun",
            usage: ">daily"
        });
    }

    async run(message: Message, args: Array<string>) {
        
    }
}

export = CreatePass;