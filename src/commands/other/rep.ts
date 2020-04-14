import { Command } from "../../domain/Command";
import { Message, GuildMember } from "discord.js";
import { DateTime } from "luxon";
import { client } from "../../main";
import humanizeDuration from "humanize-duration";
import { CooldownObject } from "../../domain/ObjectModels";

class Rep extends Command {
    constructor(){
        super({
            name: "reputation",
            description: "Команда которой вы можете поднять репутацию одного из пользователей. Можно использовать только раз в 6 часов!",
            aliases: ["rep","respect"],
            category: "other",
            usage: ">reputatuin [Ник или упоминание пользователя]"
        });
    }

    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        var member: GuildMember = await client.provider.getMember(message, args.join(" "));
        if(member.id == message.author.id) return message.channel.send(`Вы не можете поднять репутацию самому себе!`)
        let time: string = DateTime.fromJSDate(new Date()).plus({hours: 6}).toISO();
        let cd: CooldownObject = await client.provider.getCooldown(message.guild!.id,message.author.id,"REPUTATION");
        var string: string;
        if(cd == null) {
            await client.provider.updateRanks(message.guild!.id,member.id,{reputation:1})
            message.channel.send(`Вы успешно подняли репутацию пользователя ${member.displayName}`)
            return await client.provider.createCooldown(message.guild!.id,message.author.id,"REPUTATION",time)
        }else{
            var k: number = DateTime.fromJSDate(cd.expiresAt).toMillis() - DateTime.fromJSDate(new Date()).toMillis()
            if( k < 0 ){
                await client.provider.updateRanks(message.guild!.id,member.id,{reputation:1})
                message.channel.send(`Вы успешно подняли репутацию пользователя ${member.displayName}`)
                await client.provider.deleteCooldown(message.guild!.id,message.author.id,"REPUTATION")
                return await client.provider.createCooldown(message.guild!.id,message.author.id,"REPUTATION",time)
            }else{
                string = humanizeDuration(k,{language: "ru", delimiter: " и ", largest: 2, round: true})
                message.channel.send(`Вы уже поднимали репутацию пользователя недавно! Попробуйте снова через: \`${string}\``)
            }            
        }
    }
}

export = Rep;