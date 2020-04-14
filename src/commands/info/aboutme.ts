import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { client } from "../../main";
import { stripIndent } from "common-tags";
import { UserProfileData } from "../../domain/ObjectModels";

class AboutMe extends Command {
    constructor(){
        super({
            name: "aboutme",
            description: "Команда которой вы можете изменить информацию о себе.",
            category: "info"
        });
    }

    async run(message: Message, args: Array<string>) {
        if(!args[0]){
            const profile: UserProfileData = await client.provider.getProfile(message.guild!.id,message.author.id)
            const embed: MessageEmbed = new MessageEmbed()
                .setAuthor(`Ваша информация о себе`)
                .setDescription(stripIndent`${profile.about}
                ---------------------------------------------------------------`)
                .addField(`Что бы изменить информацию о себе напишите:`, `\`\`\`>aboutme Я очень люблю какать по ночам 🤤 ☝️ \`\`\``)
                .setFooter(`Че.`)
                .setTimestamp()
                .setColor('GREEN')
            return message.channel.send(embed)
        }
        if(args[0].length < 1) return message.channel.send(`Минимальная длинна 1 символ.`)
        if(await client.provider.updateProfile(message.guild!.id,message.author.id,{about:args.slice(0).join(" ")}) === true){
            message.channel.send(`Информация о себе успешно изменена!`)
        }else{
            message.channel.send(`Произошла ошибкуа при изменении инофрмации о себе!`)
        }
    }
}

export = AboutMe;