import { Command } from "../../domain/Command";
import {Message, MessageEmbed, GuildMember, Role, TextChannel} from "discord.js";
import { client } from "../../main";
import { stripIndents } from "common-tags"
import { UserProfileData } from "../../domain/ObjectModels";
import { DateTime } from "luxon";

class WhoIs extends Command {
    constructor(){
        super({
            name: "whois",
            description: "Показывает информацию об определенном пользователе.",
            usage: ">whois [Упоминание или ник пользователя]",
            category: "info",
            aliases: ["userinfo","user","ws"]
        });
    }

    async run(message: Message, args: Array<string>) {
        const member: GuildMember = await client.provider.getMember(message, args.join(" "));
        const profile: UserProfileData = await client.provider.getProfile(message.guild!.id,member.id)

        // Member variables
        const joined: string = new Date((member.joinedAt as Date)).toLocaleString();
        const roles: string = member?.roles.cache
            .filter((r: Role) => r.id !== message.guild!.id)
            .map((r: Role) => r).join(", ") || 'none';

        //const lastCh = await <TextChannel>message.guild?.channels.cache.get(<string>member.lastMessageChannelID);
        //const lastMsg = await lastCh?.messages.fetch(<string>member.lastMessageID);
        //const last = new Date(lastMsg.createdTimestamp).toLocaleString();

        // User variables
        const created: string = new Date(member.user.createdAt).toLocaleString();

        const embed: MessageEmbed = new MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL({format:'png', size:2048}))
            .setThumbnail(member.user.displayAvatarURL({format:'png', size:2048}))
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Информация об участнике:  ', stripIndents`**> Отображаемое имя:** ${member.displayName}
            **> Зашёл на сервер:** ${joined}
            **> Роли:** ${roles}
            **> О себе:** ${profile.about}`, true)

            .addField('Информация о пользователе:', stripIndents`**> ID:** ${member.user.id}
            **> Имя пользователя:** ${member.user.username}
            **> Тег:** ${member.user.tag}
            **> Создан:** ${created}`, true)
            
            .setTimestamp()

        await message.channel.send(embed);
    }
}

export = WhoIs;