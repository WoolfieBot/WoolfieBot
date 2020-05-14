import { Command } from "../../domain/Command";
import { Message, GuildMember, MessageEmbed, MessageReaction } from "discord.js";
import { client } from "../../main";
import { PunishmentObject } from "../../domain/ObjectModels";

class Punishments extends Command {
    constructor(){
        super({
            name: "punishments",
            usage: ">punishments",
            description: "Список всех наказаний на сервере. (Выданные ботом)",
            category: "moderation",
            aliases: ["pun","his"]
        });
    }
    
    async run(message: Message, args: Array<string>) {
        return
    }
}

export = Punishments;