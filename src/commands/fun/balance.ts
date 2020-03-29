import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { client } from "../../main";
import { DateTime } from "luxon";
import humanizeDuration from "humanize-duration";

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
        let string;
        let cd = await client.provider.getCooldown(message.guild!.id,message.author.id,"DAILY");
        if(cd == null) {
            string = "Пора забрать бонус!"
        }else{
            var k = DateTime.fromJSDate(cd.expiresAt).toMillis() - DateTime.fromJSDate(new Date()).toMillis()
            if( k < 0 ){ 
                string = "Пора получать бонус!"
            }else{
                string = humanizeDuration(k,{language: "ru", delimiter: " и ", largest: 2, round: true})
            }            
        }        
        const embed = new MessageEmbed()
            .setTitle(`💰Банк пользователя ${message.member?.displayName}`)
            .setDescription(`🏦**Баланс:** ${profile.bank}/${bankMax}\n💸**Наличные:** ${profile.coins}\n⏰**Ежедневный бонус:** \`${string}\``)
            .setTimestamp()
            .setFooter(`Woolfie 2020 Все права загавканы.`,(message.guild?.iconURL({format:'png'}) as any))
        message.channel.send(embed)
    }
}
export = Balance;