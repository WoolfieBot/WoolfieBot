import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { DateTime } from "luxon";
import { client } from "../../main";
import humanizeDuration from "humanize-duration";
import { CooldownObject } from "../../domain/ObjectModels";

class Daily extends Command {
    constructor(){
        super({
            name: "daily",
            description: "Введите данную команду что бы получить бонус в виде монет! Можно получить только раз в 12 часов.",
            aliases: ["d","bonus","dy"],
            category: "other",
            usage: ">daily"
        });
    }

    async run(message: Message, args: Array<string>) {
        let time: string = DateTime.fromJSDate(new Date()).plus({hours: 12}).toISO()
        let cd: CooldownObject = await client.provider.getCooldown(message.guild!.id,message.author.id,"DAILY");
        var string: string;
        if(cd == null) {
            await client.provider.updateRanks(message.guild!.id,message.author.id,{coins:500})
            message.channel.send(`Вы успешно получили ежедневный бонус в виде **500 монет!** приходите снова через 12 часов ;)`)
            return await client.provider.createCooldown(message.guild!.id,message.author.id,"DAILY",time)
        }else{
            var k: number = DateTime.fromJSDate(cd.expiresAt).toMillis() - DateTime.fromJSDate(new Date()).toMillis()
            if( k < 0 ){ 
                await client.provider.updateRanks(message.guild!.id,message.author.id,{coins:500})
                message.channel.send(`Вы успешно получили ежедневный бонус в виде **500 монет!** приходите снова через 12 часов ;)`)
                await client.provider.deleteCooldown(message.guild!.id,message.author.id,"DAILY")
                return await client.provider.createCooldown(message.guild!.id,message.author.id,"DAILY",time)
            }else{
                string = humanizeDuration(k,{language: "ru", delimiter: " и ", largest: 2, round: true})
                message.channel.send(`Вы уже получали бонус недавно! Попробуйте снова через: \`${string}\``)
            }            
        }         
    }
}

export = Daily;