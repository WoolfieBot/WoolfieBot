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
            category: "info",
            usage: ">balance"
        });
    }

    async run(message: Message, args: Array<string>) {
        // Проверка включен ли ранкинг
        const guild: any = await client.provider.getGuild(message.guild!.id);
        if(guild.isLvl === 0) return message.channel.send(`На данном сервере отключён ранкинг.`);

        // Переменные пользователя
        var member: GuildMember = await client.provider.getMember(message, args.join(" "));
        var profile: UserProfileData = await client.provider.getProfile(message.guild!.id,member.id)

        // Проверка на существование профиля
        if(profile === null){
            const roles: any = member?.roles.cache
                .filter((r: any) => r.id !== message.guild?.id)
                .map((r:any) => r.id).join(", ") || 'none';

            await client.provider.createProfile(message.guild!.id,member.id,member.user.username,member!.displayName,roles)
            profile = await client.provider.getProfile(message.guild!.id,member.id)
        }

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
                string = humanizeDuration(k,
                    {
                        language: "ru",
                        delimiter: " и ",
                        largest: 2,
                        round: true}
                    )
            }            
        }

        const embed: MessageEmbed = new MessageEmbed()
            .setTitle(`💰Банк пользователя ${member.displayName}`)
            .setDescription(`🏦**Баланс:** ${profile.bank}/${bankMax}\n💸**Наличные:** ${profile.coins}\n⏰**Ежедневный бонус:** \`${string}\``)
            .setTimestamp()
            .setFooter(`Woolfie 2020 Все права загавканы.`,(message.guild?.iconURL({format:'png'}) as string))
        await message.channel.send(embed)
    }
}
export = Balance;