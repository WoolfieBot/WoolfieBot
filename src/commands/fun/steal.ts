import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";
import { DateTime } from "luxon";
import humanizeDuration from "humanize-duration";
import { Chance } from "chance";

class Steal extends Command {
    constructor(){
        super({
            name: "steal",
            usage: ">steal [Упоминание или ник пользователя]",
            description: "Вы можете украсть процент наличных у пользователя, раз в 6 часов. С некоторым шансом вас может словить полицейский и посадит под домашний арест, увеличив вермя ожидания на 6 часов. Что бы у вас не смогли украсть деньги, кладите их в банк!",
            category: "fun",
            aliases: ["thieve","st"]
        });
    }
    async run(message: Message, args: Array<string>) {
        var chance = new Chance()
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        var member: any = await client.provider.getMember(message, args.join(" "));
        var cd = await client.provider.getCooldown(message.guild!.id,message.author.id,"STEAL");
        var profile = await client.provider.getProfile(message.guild!.id,member.id)
        var time = DateTime.fromJSDate(new Date()).plus({hours: 6}).toISO()
        var string;
        var coins = parseInt(profile.coins)
        if(coins< 100) return message.channel.send(`У данного пользователя нет чего воровать!`)
        if(cd == null) {
            let random = await client.provider.getRandomInt(2,40)
            if(chance.bool({likelihood: 10}) == true){
                message.channel.send(`Воу! Джекпот! Вы своровали **60** процентов от всей суммы наличных пользователя!`)
                random = 60;
            }
            let napizdil = Math.round(coins / 100 * random)
            if(chance.bool({likelihood: 20}) == true){
                time = DateTime.fromJSDate(new Date()).plus({hours: 12}).toISO()
                message.channel.send(`О нет! Тебя поймали, ёбаный ты вор, из-за таких как ты, нахуй, россия НА КОЛЕНЯХ. ПУТИН ВПЕРЕД! РО ССИ Я!. Вы ничего не своровали и получили доп. время отката.`)
                await client.provider.deleteCooldown(message.guild!.id,message.author.id,"STEAL")
                return await client.provider.createCooldown(message.guild!.id,message.author.id,"STEAL",time)
            }
            message.channel.send(`Вы своровали у пользователя ${member.displayName} \`${napizdil}\` монет :wink:`)
            await client.provider.updateRanks(message.guild!.id,message.author.id,{coins:napizdil})
            await client.provider.deleteCooldown(message.guild!.id,message.author.id,"STEAL")
            await client.provider.createCooldown(message.guild!.id,message.author.id,"STEAL",time)
            return await client.provider.updateProfile(message.guild!.id,member.id,{coins:(profile.coins - napizdil)})
        }else{
            var k = DateTime.fromJSDate(cd.expiresAt).toMillis() - DateTime.fromJSDate(new Date()).toMillis()
            if( k < 0 ){ 
                let random = await client.provider.getRandomInt(2,40)
                if(chance.bool({likelihood: 10}) == true){
                    message.channel.send(`Воу! Джекпот! Вы своровали **60** процентов от всей суммы наличных пользователя!`)
                    random = 60;
                }
                let napizdil = Math.round(coins / 100 * random)
                if(chance.bool({likelihood: 20}) == true){
                    time = DateTime.fromJSDate(new Date()).plus({hours: 12}).toISO()
                    message.channel.send(`О нет! Тебя поймали, ёбаный ты вор, из-за таких как ты, нахуй, россия НА КОЛЕНЯХ. ПУТИН ВПЕРЕД! РО ССИ Я!. Вы ничего не своровали и получили доп. время отката.`)
                    await client.provider.deleteCooldown(message.guild!.id,message.author.id,"STEAL")
                    return await client.provider.createCooldown(message.guild!.id,message.author.id,"STEAL",time)
                }
                message.channel.send(`Вы своровали у пользователя ${member.displayName} \`${napizdil}\` монет :wink:`)
                await client.provider.updateRanks(message.guild!.id,message.author.id,{coins:napizdil})
                await client.provider.deleteCooldown(message.guild!.id,message.author.id,"STEAL")
                await client.provider.createCooldown(message.guild!.id,message.author.id,"STEAL",time)
                return await client.provider.updateProfile(message.guild!.id,member.id,{coins:(coins - napizdil)})
            }else{
                string = humanizeDuration(k,{language: "ru", delimiter: " и ", largest: 2, round: true})
                return message.channel.send(`Ты уже воровал недавно! Попробуй снова через: \`${string}\``)
            }
        }
    }
}

export = Steal;