import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client, PREFIX } from "../../main";
import { MessageEmbed } from "discord.js";

class Help extends Command {
    constructor() {
        super({
            name:"help",
            description: "Ya sral",
            usage: ">help",
            aliases: ["pizda","chlen"],
            category: "fun"
        });
    }

    async run(message: Message, args: Array<string>) {
        let guildIcon: any = message.guild?.iconURL();
        let botAvatar: any = client.user?.displayAvatarURL();
        if(args[0]) {
            if(!client.commands.has(args[0])) return message.channel.send("Такой команды не существует!");
            message.guild?.iconURL
            if(client.commands.has(args[0])) {
                let command: any = client.commands.get(args[0]);
                var SHembed = new MessageEmbed()
                .setColor(0x333333)
                .setAuthor(`Список команд бота`, guildIcon)
                .setTimestamp()
                .setDescription(`**Префикс бота:** ${PREFIX}\n**Команда:** ${command.name}\n**Описание:** ${command.description || "Нет описания."}\n**Использование:** ${command.usage}\n**Псевдонимы:** ${command.aliases.join(", ") || "Н/Д"}`)
                .setFooter("Тот самый бот", botAvatar)
                message.channel.send(SHembed)
            }
        }
        if(!args[0]) {
            message.delete()
            let authorAvatar: any = message.author.avatarURL();
            let embed = new MessageEmbed()
            .setAuthor(`Ответ команды бота`, authorAvatar)
            .setColor(0x333333)
            .setDescription(`${message.author.username} проверь личные сообщения!`)
            let cmdName: string = "";
            client.commands.forEach(x => cmdName += x.name)
            let Sembed = new MessageEmbed()
            .setColor(0x333333)
            .setAuthor(`Список команд бота`, guildIcon)
            .setThumbnail(botAvatar)
            .setTimestamp()
            .setDescription(`Вот полный список команд которые доступны на данный момент! Что бы узнать подробное описание какой-то команды вернись на сервер и напиши >help <команда>\nПрефикс ботa: ${PREFIX}`)
            .addField(`Команды:`, `\`${cmdName}\``)
            .setFooter("Тот самый бот", botAvatar)
            message.channel.send(embed).then(m => m.delete({timeout:30000}));
            message.author.send(Sembed)
        } 
    }

}

export = Help;