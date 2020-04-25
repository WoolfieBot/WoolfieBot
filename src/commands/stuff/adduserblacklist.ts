import { Command } from "../../domain/Command";
import { Message } from "discord.js";

class AddUserBlacklist extends Command {
    constructor(){
        super({
            name: "adduserblacklist",
            description: "Команда для владельца бота позволяющая добавить пользователя в черный список бота.",
            category: "stuff",
            aliases: ["addubl"]  
        });
    }
    
    async run(message: Message, args: Array<string>) {
        
    }
}

export = AddUserBlacklist;