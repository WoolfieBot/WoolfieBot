import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";
import { MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";

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
        let guildIcon: string = <string>message.guild?.iconURL();
        let botAvatar: string = <string>client.user?.displayAvatarURL();
        if(args[0]) {
            if(!client.commands.has(args[0])) return message.channel.send("Такой команды не существует!");
            message.guild?.iconURL
            if(client.commands.has(args[0])) {
                let command: Command | undefined = client.commands.get(args[0]);
                var SHembed = new MessageEmbed()
                .setColor(0x333333)
                .setAuthor(`Список команд бота`, guildIcon)
                .setTimestamp()
                .setDescription(`**Префикс бота:** >>\n**Команда:** ${command?.name}\n**Описание:** ${command?.description || "Нет описания."}\n**Использование:** ${command?.usage}\n**Псевдонимы:** ${command?.aliases.join(", ") || "Н/Д"}\n**Категория:** ${command?.category}`)
                .setFooter("Тот самый бот", botAvatar)
                message.channel.send(SHembed)
            } 
        }
        if(!args[0]) {
            message.delete()
            let authorAvatar: string = <string>message.author.avatarURL();
            let embed = new MessageEmbed()
            .setAuthor(`Ответ команды бота`, authorAvatar)
            .setColor(0x333333)
            .setDescription(`${message.author.username} проверь личные сообщения!`)
            let embedString1: string = "";
            let embedString2: string = "";
            var Sembed: MessageEmbed = new MessageEmbed()
            let i = 0;
            client.category.forEach(element => {                
                i++;
                if(i > 3) {
                    embedString2 += `\n**> ${element.toUpperCase()}:**`
                }else{
                    embedString1 += `\n**> ${element.toUpperCase()}:**`
                }                
                client.commands.forEach(x => {
                    if(i > 3) {
                        if(x.category == element){
                            embedString2 += `\n**${x.name.charAt(0).toUpperCase() + x.name.slice(1)}**: ${x.description}\n`
                        }
                    }else{
                        if(x.category == element){
                            embedString1 += `\n**${x.name.charAt(0).toUpperCase() + x.name.slice(1)}**: ${x.description}\n`
                        }
                    }
                })
            });            
            Sembed.setColor(0x333333)
            .setAuthor(`Список команд бота`, guildIcon)
            .setThumbnail(botAvatar)
            .setDescription(`Вот полный список команд которые доступны на данный момент! Что бы узнать подробное описание какой-то команды вернись на сервер и напиши >help <команда>\nПрефикс ботa: >>`)
            .addField("Команды:", embedString1, true)
            message.channel.send(embed).then(m => m.delete({timeout:30000}));
            let che = new MessageEmbed().addField("\u2063", embedString2, true).setTimestamp().setFooter('Тот самый бот', botAvatar).setColor(0x333333)
            message.author.send(Sembed)
            message.author.send(che)
        } 
    }

}

export = Help;