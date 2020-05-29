import { Command } from "../../domain/Command";
import { Message, GuildMember } from "discord.js";
import { client } from "../../main";
import { DateTime } from "luxon";
import humanizeDuration from "humanize-duration";
import { Chance } from "chance";
import { CooldownObject, UserProfileData } from "../../domain/ObjectModels";

class Steal extends Command {
    constructor(){
        super({
            name: "steal",
            usage: ">steal [Упоминание или ник пользователя]",
            description: "Вы можете украсть процент наличных у пользователя, раз в 6 часов.",
            category: "works",
            aliases: ["thieve","st"]
        });
    }
    async run(message: Message, args: Array<string>) {
        const chance = new Chance();
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        const member: GuildMember = await client.provider.getMember(message, args.join(" "));
        if(member.id == message.author.id) return await message.channel.send('Вы не можете своровать сами у себя!')
        const cd: CooldownObject = await client.provider.getCooldown(message.guild!.id, message.author.id, "STEAL");
        const profile: UserProfileData = await client.provider.getProfile(message.guild!.id, member.id);
        let time = DateTime.fromJSDate(new Date()).plus({hours: 6}).toISO();
        let string: string;
        const coins: number = profile.coins;
        if(coins< 100) return message.channel.send(`У данного пользователя нет чего воровать!`)
        if(cd == null) {
            let itemsObj = JSON.parse(profile.items)
            if(itemsObj['shield'].lastUse !== null) {
                await message.channel.send('У данного пользователя щит! Вы не можете у него своровать деньги!')
                itemsObj['shield'].lastUse = DateTime.fromMillis(itemsObj['shield'].lastUse).minus({hours: 1}).toMillis()
                await client.provider.updateProfile(message.guild!.id, message.author.id,{items: JSON.stringify(itemsObj)})
                await client.provider.deleteCooldown(message.guild!.id,message.author.id,"STEAL")
                await client.provider.createCooldown(message.guild!.id,message.author.id,"STEAL",time)
                return
            }
            let used = false;
            if(itemsObj['reverse_card'].lastUse == null && itemsObj['reverse_card'].amount >= 1) {
                itemsObj['reverse_card'].lastUse = DateTime.fromJSDate(new Date()).plus({hours: 6}).toMillis()
                itemsObj['reverse_card'].amount = itemsObj['reverse_card'].amount - 1
                await client.provider.updateProfile(message.guild!.id, member.id,{items: JSON.stringify(itemsObj)})
                const filter = (response: Message) => {
                    return response.content === '>reverse' && response.author.id === member.id;
                };
                await message.channel.send(`Воу! У данного пользователя есть **Карточка возврата**! <@${member.id}>, у вас есть 5 минут что бы использовать ее! (>reverse)`).then(async () => {
                    await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                        .then(collected => {
                            used = true;
                            message.channel.send(`Пользователь успел использовать карточку возврата!`);
                        })
                        .catch(collected => {
                            message.channel.send('Пользователь не успел использовать карточку возврата! :( \nКарточка возврата потеряна!');
                        });
                });
            }
            if(used) {
                await client.provider.deleteCooldown(message.guild!.id,message.author.id,"STEAL")
                await client.provider.createCooldown(message.guild!.id,message.author.id,"STEAL",time)
                return message.channel.send('Попытка воровства аннулирована!')
            }
            let random: number = await client.provider.getRandomInt(2,40)
            if(chance.bool({likelihood: 10})){
                await message.channel.send(`Воу! Джекпот! Вы своровали **60** процентов от всей суммы наличных пользователя!`)
                random = 60;
            }
            let napizdil: number = Math.round(coins / 100 * random)
            if(chance.bool({likelihood: 20})){
                time = DateTime.fromJSDate(new Date()).plus({hours: 12}).toISO()
                await message.channel.send(`О нет! Тебя поймали, ёбаный ты вор, из-за таких как ты, нахуй, россия НА КОЛЕНЯХ. ПУТИН ВПЕРЕД! РО ССИ Я!. Вы ничего не своровали и получили доп. время отката.`)
                await client.provider.deleteCooldown(message.guild!.id,message.author.id,"STEAL")
                return await client.provider.createCooldown(message.guild!.id,message.author.id,"STEAL",time)
            }
            await message.channel.send(`Вы своровали у пользователя ${member.displayName} \`${napizdil}\` монет :wink:`)
            await client.provider.updateRanks(message.guild!.id,message.author.id,{coins:napizdil})
            await client.provider.deleteCooldown(message.guild!.id,message.author.id,"STEAL")
            await client.provider.createCooldown(message.guild!.id,message.author.id,"STEAL",time)
            return await client.provider.updateProfile(message.guild!.id,member.id,{coins:(profile.coins - napizdil)})
        }else{
            const k: number = DateTime.fromJSDate(cd.expiresAt).toMillis() - DateTime.fromJSDate(new Date()).toMillis();
            if( k < 0 ){
                let random: number = await client.provider.getRandomInt(2,40)
                if(chance.bool({likelihood: 10})){
                    await message.channel.send(`Воу! Джекпот! Вы своровали **60** процентов от всей суммы наличных пользователя!`)
                    random = 60;
                }
                let napizdil: number = Math.round(coins / 100 * random)
                if(chance.bool({likelihood: 20})) {
                    time = DateTime.fromJSDate(new Date()).plus({hours: 12}).toISO()
                    await message.channel.send(`О нет! Тебя поймали, ёбаный ты вор, из-за таких как ты, нахуй, россия НА КОЛЕНЯХ. ПУТИН ВПЕРЕД! РО ССИ Я!. Вы ничего не своровали и получили доп. время отката.`)
                    await client.provider.deleteCooldown(message.guild!.id,message.author.id,"STEAL")
                    return await client.provider.createCooldown(message.guild!.id,message.author.id,"STEAL",time)
                }
                await message.channel.send(`Вы своровали у пользователя ${member.displayName} \`${napizdil}\` монет :wink:`)
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