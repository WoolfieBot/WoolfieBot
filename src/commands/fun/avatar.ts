import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { client } from "../../main";

class Avatar extends Command {
    constructor(){
        super({
            name: "avatar",
            description: "Test command",
            aliases: ["a","ava"],
            category: "fun",
            usage: ">avatar [Упоминание или ник пользователя]"
        });
    }

    async run(message: Message, args: Array<string>) {
        const member = await client.provider.getMember(message, args.join(" "))

        var embed = new MessageEmbed()
            .setAuthor(`Аватар пользователя ${member.displayName || member.user.username}`)
            .setImage(member.user.displayAvatarURL({format:'png', size:2048}))
        message.channel.send(embed)
    }
}

export = Avatar;