import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../domain/Command";
import sequelize from "../../models/sequelize";
import { client } from "../../main";
import { UserProfileData } from "../../domain/ObjectModels";

class Leaders extends Command {
    constructor(){
        super({
            name: "leaders",
            usage: ">leaders",
            description: "Команда позволяющая увидеть топ самых активных пользователей сервера!",
            category: "info",
            aliases: ["top","lead"]
        });
    }
    async run(message: Message, args: Array<string>) {
        const top: Array<UserProfileData> = await sequelize.models.profiles.findAll({
            where: {guildID: message.guild!.id},
            order: [['lvl', 'DESC']],
            limit: 10
        });
        let string: string = "";
        for (let index: number = 0; index < top.length; index++) {
            const element: UserProfileData = top[index];
            if(index === 0){
                string += `🌟 #1. ${element.userDisplayName}\n**Уровень:** ${element.lvl} | **Опыт:** ${element.xp} | 🍖 ${element.reputation} | 💰 ${element.coins}\n`
            }else{
                if (index <= 2){
                    string += `⭐ #${index + 1}. ${element.userDisplayName}\n**Уровень:** ${element.lvl} | **Опыт:** ${element.xp} | 🍖 ${element.reputation} | 💰 ${element.coins}\n`  
                }else{
                    string += `#${index + 1}. ${element.userDisplayName}\n**Уровень:** ${element.lvl} | **Опыт:** ${element.xp} | 🍖 ${element.reputation} | 💰 ${element.coins}\n`
                }
            }  
        }
        const embed: MessageEmbed = new MessageEmbed()
            .setTitle(`🏆 Топ рейтинга участников ${message.guild?.name}`)
            .setDescription(string)
            .setTimestamp()
            .setThumbnail((message.guild?.iconURL({format: 'png'}) as any))
            .setFooter(`Woolfie 2020 Все права загавканы.`,(client.user?.avatarURL({format: 'png'}) as any))
        await message.channel.send(embed)
    }
}

export = Leaders;