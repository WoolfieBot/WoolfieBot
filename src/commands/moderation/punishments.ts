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
        const punishmentsArray: Array<string> = [""];
        let punishments: Array<PunishmentObject> = await client.provider.getAllPunishments(message.guild!.id);
        if(punishments.length == 0) return await message.channel.send(`На данном сервере еще не выдавались наказания ботом.`)
        let str: string = "";
        let elementID: number = 0;
        for (const element of punishments) {
            let user = message.guild?.members.cache.get(element.punishableID)?.displayName;
            let actorUser = message.guild?.members.cache.get(element.producerID)?.displayName;
            let isActive: string = "";
            let type: string = "";
            if(element.type == "TEMPMUTE") type = 'Временный мут';
            if(element.type == "MUTE") type = 'Мут';
            if(element.type == "BAN") type = 'Бан';
            if(element.type == "TEMPBAN") type = 'Временный бан';
            if(element.active == 0){
                isActive = "Нет";
            } else {
                isActive = "Да";
            }
            str += `> **Наказуемый:** ${user} | **Выдан:** ${actorUser}\n **Тип наказания:** ${type} | **Причина:** ${element.reason} | **Активный?:** ${isActive} | **Когда выдан:** ${new Date(element.punishedAt).toLocaleString()}\n`
            if(punishmentsArray[elementID].length + str.length > 1024) {
                elementID++;
            }
            punishmentsArray[elementID] += str;
            str = "";
            if(punishments.length == 0) {
                if(punishmentsArray[elementID].length > 0) {
                    await message.channel.send('ok')
                }
            }
        }
        let a = 0;
        let Embed = new MessageEmbed()
            .setColor(0x333333)
            .setTitle(`<:monkaTOS:710886743502618755> **Все наказания для сервера:** \`${message.guild?.name}\``)
            .setTimestamp()
            .setDescription(`${punishmentsArray[a]}`)
            .setFooter(`${Math.floor(a + 1)}/${punishmentsArray.length} страниц`, client.user?.displayAvatarURL({format: 'png', size:256}))
        message.channel.send(Embed).then( msg => {
            msg.react('◀').then(() => msg.react('▶')).then(() => msg.react('❌'));
            const filter = (reaction: MessageReaction, user: GuildMember) => {
                return ['◀', '▶', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            const collector = msg.createReactionCollector(filter, { time: 120000 });
            collector.on('collect', r => {
                let Embed = new MessageEmbed()
                    .setColor(0x333333)
                    .setTitle(`<:monkaTOS:710886743502618755> **Все наказания для сервера:** \`${message.guild?.name}\``)
                    .setTimestamp()
                    .setDescription(`${punishmentsArray[a]}`)
                    .setFooter(`${Math.floor(a + 1)}/${punishmentsArray.length} страниц`, client.user?.displayAvatarURL({format: 'png', size:256}))
                if (r.emoji.name === '▶') {
                    a++;
                    if (a == punishmentsArray.length) {
                        a = 0
                    }
                    Embed.setFooter(`${Math.floor(a + 1)}/${punishmentsArray.length} страниц`, client.user?.displayAvatarURL({format: 'png',size:256}))
                    Embed.setDescription(`${punishmentsArray[a]}`)
                    msg.edit(Embed);
                }
                if (r.emoji.name === '◀') {
                    a--;
                    if (a == -1) {
                        a = punishmentsArray.length - 1
                    }
                    Embed.setFooter(`${Math.floor(a + 1)}/${punishmentsArray.length} страниц`, client.user?.displayAvatarURL({format: 'png',size:256}))
                    Embed.setDescription(`${punishmentsArray[a]}`)
                    msg.edit(Embed);
                }
                if (r.emoji.name === '❌') {
                    message.delete();
                    msg.delete();
                }
            });
            collector.on('end', collected => a = 0);
        });
    }
}

export = Punishments;