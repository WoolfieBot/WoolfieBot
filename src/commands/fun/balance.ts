import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { client } from "../../main";

class Balance extends Command {
    constructor(){
        super({
            name: "balance",
            description: "Команда для проверки баланса налички и банка.",
            aliases: ["b","bal"],
            category: "fun",
            usage: ">balance"
        });
    }

    async run(message: Message, args: Array<string>) {
        var profile = await client.provider.getProfile(message.guild!.id,message.author.id)
        var bankMax = 10000 + (5000 * profile.bankLvl);

        const embed = new MessageEmbed()
            .setTitle(`💰Банк пользователя ${message.member?.displayName}`)
            .setDescription(`🏦**Баланс:** ${profile.bank}/${bankMax}\n💸**Наличные:** ${profile.coins}\n⏰**Ежедневный бонус:** В разработке ;)`)
            .setTimestamp()
            .setFooter(`Woolfie 2020 Все права загавканы.`,(message.guild?.iconURL({format:'png'}) as any))
        message.channel.send(embed)
    }
}

export = Balance;