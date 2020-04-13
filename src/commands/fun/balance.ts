import { Command } from "../../domain/Command";
import { Message, MessageEmbed, GuildMember } from "discord.js";
import { client } from "../../main";
import { DateTime } from "luxon";
import humanizeDuration from "humanize-duration";
import { UserProfileData, CooldownObject } from "../../domain/ObjectModels";

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
        var member: GuildMember = await client.provider.getMember(message, args.join(" "));
        var profile: UserProfileData = await client.provider.getProfile(message.guild!.id,member.id)
        var bankMax: number = 10000 + (5000 * profile.bankLvl);
        let string: string;
        let cd: CooldownObject = await client.provider.getCooldown(message.guild!.id,member.id,"DAILY");
        if(cd == null) {
            string = "Пора забрать бонус!"
        }else{
            var k: number = DateTime.fromJSDate(cd.expiresAt).toMillis() - DateTime.fromJSDate(new Date()).toMillis()
            if( k < 0 ){ 
                string = "Пора получать бонус!"
            }else{
                string = humanizeDuration(k,{language: "ru", delimiter: " и ", largest: 2, round: true})
            }            
        }        
        const embed: MessageEmbed = new MessageEmbed()
            .setTitle(`💰Банк пользователя ${member.displayName}`)
            .setDescription(`🏦**Баланс:** ${profile.bank}/${bankMax}\n💸**Наличные:** ${profile.coins}\n⏰**Ежедневный бонус:** \`${string}\``)
            .setTimestamp()
            .setFooter(`Woolfie 2020 Все права загавканы.`,(message.guild?.iconURL({format:'png'}) as string))
        message.channel.send(embed)
    }
}
export = Balance;