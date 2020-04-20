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
        const punishments: Array<PunishmentObject> = await client.provider.getAllPunishments(message.guild!.id);

        var punishmentsString: Array<string> = [];
        await punishments.forEach(async element => {
            let punishedUser: string = <string>message.guild!.members.cache.get(element.punishableID)?.displayName;
            let producerUser: GuildMember = <GuildMember>message.guild!.members.cache.get(element.producerID);
            punishmentsString.push(`#. ${punishedUser ? punishedUser : element.punishableID}\n**Тип наказания:** ${element.type} | **Причина:** ${element.reason} | **Наказание выдал:** ${producerUser.displayName} | **Когда получил:** ${new Date(element.punishedAt).toLocaleString()}\n`);
        })
        var embed = new MessageEmbed()
        var string: string = "";
        if(punishmentsString.length > 10){
            punishmentsString.slice(0,9).forEach(element => {
                string += element;
            })
            embed.setDescription(string)
            message.channel.send(embed).then(async m => {
                let now: number = 0;
                m.react("◀️")
                m.react("▶️")
                const filter =  (reaction: MessageReaction, user: GuildMember) => reaction.emoji.name == '◀️' || reaction.emoji.name == '▶️' && user.id == message.author.id;
                const collector = m.createReactionCollector(filter,{time: 60000});
                collector.on('collect', r => {
                    if(r.emoji.name == '▶️') {
                        now++;
                        if(now*10+9 > punishmentsString.length){
                            let newStr: string = "";
                            now = 0;
                            punishmentsString.slice(0,9).forEach(e => {
                                newStr += e;
                            })
                            embed.setDescription(newStr)
                            m.edit(embed);
                        }else{
                            let newStr: string = "";
                            punishmentsString.slice(now*10-1,now*10+9).forEach(e => {
                                newStr += e;
                            })
                            embed.setDescription(newStr)
                            m.edit(embed);
                        }                        
                    }else{
                        now--;
                        if(now*10+9 < punishmentsString.length){
                            let newStr: string = "";
                            punishmentsString.slice(0,9).forEach(e => {
                                newStr += e;
                            })
                            embed.setDescription(newStr)
                            m.edit(embed);
                        }else{
                            let newStr: string = "";
                            punishmentsString.slice(now*10-1,now*10+9).forEach(e => {
                                newStr += e;
                            })
                            embed.setDescription(newStr)
                            m.edit(embed);
                        }
                    }
                })
            })
        }else{
            punishmentsString.forEach(element =>{
                string += element;
            })
            embed.setDescription(string)
            message.channel.send(embed);
        }       

    }
}

export = Punishments;