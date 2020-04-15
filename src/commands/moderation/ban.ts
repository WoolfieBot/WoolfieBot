import { Command } from "../../domain/Command";
import { Message } from "discord.js";;

class Ban extends Command {
    constructor(){
        super({
            name: "ban",
            usage: ">ban [Упоминание или ник пользователя] [Причина]",
            description: "ПИЗДЕЦ НАХУЙ БАААААН БЛЯТЬ ДА СУКА БАН НАХУЙ БААААН",
            category: "moderation"
        });
    }
    
    async run(message: Message, args: Array<string>) {

    }
}

export = Ban;