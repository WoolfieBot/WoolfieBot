import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";
import { MessageEmbed } from "discord.js";

class Help extends Command {
    constructor() {
        super({
            name:"help",
            description: "Единственный, кто ответит на твои просьбы о помощи. <:feelsbadman:604775495040630907>",
            usage: ">help [Название команды]",
            aliases: ["h"],
            category: "info"
        });
    }
 
    async run(message: Message, args: Array<string>) {
        const textMap = new Map();
        let guildIcon: string = <string>message.guild?.iconURL();
        let botAvatar: string = <string>client.user?.displayAvatarURL();
        if(args[0]) {
            if(!client.commands.has(args[0])) return message.channel.send("Такой команды не существует!");
            if(client.commands.has(args[0])) {
                let command: Command | undefined = client.commands.get(args[0]);
                const SHembed = new MessageEmbed()
                    .setColor(0x333333)
                    .setAuthor(`Список команд бота`, guildIcon)
                    .setTimestamp()
                    .setDescription(`**Префикс бота:** >>\n**Команда:** ${command?.name}\n**Описание:** ${command?.description || "Нет описания."}\n**Использование:** ${command?.usage}\n**Псевдонимы:** ${command?.aliases.join(", ") || "Н/Д"}\n**Категория:** ${command?.category}`)
                    .setFooter("Тот самый бот", botAvatar);
                await message.channel.send(SHembed)
            }
        }
        if(!args[0]) {
            await message.delete()
            let authorAvatar: string = <string>message.author.avatarURL();
            let embed = new MessageEmbed()
            .setAuthor(`Ответ команды бота`, authorAvatar)
            .setColor(0x333333)
            .setDescription(`${message.author.username} проверь личные сообщения!`)
            const Sembed: MessageEmbed = new MessageEmbed();
            client.category.forEach(element => {
                let categoryName = element;
                client.commands.forEach(element => {
                    if(element.category == categoryName){
                        textMap.set(element.name, categoryName + "~" + element.description);
                    }
                })
            });
            Sembed.setColor(0x333333)
                .setAuthor(`Список команд бота`, guildIcon)
                .setThumbnail(botAvatar)
                .setDescription(`Вот полный список команд которые доступны на данный момент! Что бы узнать подробное описание какой-то команды вернись на сервер и напиши >help <команда>\nПрефикс ботa: >>`)
            message.channel.send(embed).then(m => m.delete({timeout:30000}));
            await message.author.send(Sembed)
            let embedString: string = "";
            let str: string = "";
            for (const element of client.category) {
                str += `\n**> ${element.toUpperCase()}:**`;
                textMap.forEach((cmdInfo, Name) => {
                    let cmdCategory: string = cmdInfo.substr(0, cmdInfo.indexOf('~'));
                    let cmdName: string = Name;
                    let cmdDesc: string = cmdInfo.substr(cmdInfo.indexOf('~') + 1);
                    if (element == cmdCategory) {
                        textMap.delete(Name);
                        str += `\n**${cmdName.charAt(0).toUpperCase() + cmdName.slice(1)}**: ${cmdDesc}\n`;
                        if (embedString.length + str.length > 1024) {
                            const che = new MessageEmbed().setTimestamp().setFooter('Тот самый бот', botAvatar).setColor(0x333333).addField("\u2063", embedString);
                            message.author.send(che);
                            embedString = str;
                            str = "";
                        }
                        embedString += str;
                        str = "";
                        if(textMap.size == 0) {
                            if(embedString.length > 0) {
                                const che = new MessageEmbed().setTimestamp().setFooter('Тот самый бот', botAvatar).setColor(0x333333).addField("\u2063", embedString);
                                message.author.send(che);
                            }
                        }
                    }
                })
            }
        }
    }

}

export = Help;