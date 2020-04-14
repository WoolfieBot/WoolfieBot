import { Command } from "../../domain/Command";
import { Message, MessageEmbed, GuildMember } from "discord.js";
import { client } from "../../main";

class Avatar extends Command {
    constructor(){
        super({
            name: "avatar",
            description: "Команда с помощью которой можно увидеть аватар пользователя!",
            aliases: ["a","ava"],
            category: "info",
            usage: ">avatar [Упоминание или ник пользователя]"
        });
    }

    async run(message: Message, args: Array<string>) {
        const member: GuildMember = await client.provider.getMember(message, args.join(" "))

        var embed: MessageEmbed = new MessageEmbed()
            .setAuthor(`Аватар пользователя ${member.displayName || member.user.username}`)
            .setImage(member.user.displayAvatarURL({format:'png', size:2048}))
        message.channel.send(embed)
    }
}

export = Avatar;