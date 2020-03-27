import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { client } from "../../main";
import { stripIndents } from "common-tags"

class WhoIs extends Command {
    constructor(){
        super({
            name: "whois",
            description: "Показывает информацию об определенном пользователе.",
            usage: ">whois [Упоминание или ник пользователя]",
            category: "fun",
            aliases: ["userinfo","user","ws"]
        });
    }

    async run(message: Message, args: Array<string>) {
        const member: any = await client.provider.getMember(message, args.join(" "));
        const profile = await client.provider.getProfile(message.guild!.id,member.id)

        // Member variables
        const joined: any = new Date(member.joinedAt).toLocaleString();
        const roles: any = member?.roles.cache
            .filter((r: any) => r.id !== message.guild!.id)
            .map((r: any) => r).join(", ") || 'none';

        // User variables
        const created = new Date(member.user.createdAt).toLocaleString();

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Информация об участнике:  ', stripIndents`**> Отображаемое имя:** ${member.displayName}
            **> Зашёл на сервер:** ${joined}
            **> Роли:** ${roles}
            **> О себе:** ${profile.about}`, true)

            .addField('  Информация о пользователе:', stripIndents`**> ID:** ${member.user.id}
            **> Имя пользователя:** ${member.user.username}
            **> Тег:** ${member.user.tag}
            **> Создан:** ${created}`, true)
            
            .setTimestamp()

        if (member.user.presence.game) 
            embed.addField('Сейчас играет', stripIndents`**> Название:** ${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}

export = WhoIs;