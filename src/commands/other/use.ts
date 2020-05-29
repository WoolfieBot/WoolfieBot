import {Command} from "../../domain/Command";
import {Message} from "discord.js";
import {client} from "../../main";
import {DateTime} from "luxon";
import humanizeDuration from "humanize-duration";
import { Chance } from "chance";

class Use extends Command {
    constructor() {
        super({
            name: "use",
            description: "Команда для использования вещей из инвентаря.",
            category: "other",
            usage: ">use <ID Предмета>"
        });
    }

    async run(message: Message, args: Array<string>) {
        const profile = await client.provider.getProfile(message.guild!.id,message.author.id)
        let itemsObj = JSON.parse(profile.items)
        let last_use;

        switch (args[0]) {
            case "1":
                if(itemsObj["xp_boost"].amount == 0) return await message.channel.send('У вас нет предмета **Бустер опыта** что бы использовать его!')
                if(itemsObj["xp_boost"].lastUse !== null) {
                    const k: number = itemsObj["xp_boost"].lastUse - DateTime.fromJSDate(new Date()).toMillis();
                    return await message.channel.send(`У вас уже активирован предмет **Бустер опыта**! Попробуйте снова через: \`${humanizeDuration(k,{language: "ru", delimiter: " и ", largest: 2, round: true})}\``)
                }
                last_use = DateTime.fromJSDate(new Date()).plus({hours: 8}).toMillis()
                itemsObj["xp_boost"].lastUse = last_use
                itemsObj["xp_boost"].amount = parseInt(itemsObj["xp_boost"].amount) - 1;
                await client.provider.updateProfile(message.guild!.id,message.author.id,{items: JSON.stringify(itemsObj)})
                await message.channel.send('Вы успешно использовали предмет **Бустер опыта**! Осталось в инвентаре: '+ itemsObj["xp_boost"].amount)
                break
            case "2":
                if(itemsObj["shield"].amount == 0) return await message.channel.send('У вас нет предмета **Щит для наличных** что бы использовать его!')
                if(itemsObj["shield"].lastUse !== null) {
                    const k: number = itemsObj["shield"].lastUse - DateTime.fromJSDate(new Date()).toMillis();
                    return await message.channel.send(`У вас уже активирован предмет **Щит для наличных**! Попробуйте снова через: \`${humanizeDuration(k,{language: "ru", delimiter: " и ", largest: 2, round: true})}\``)
                }
                last_use = DateTime.fromJSDate(new Date()).plus({hours: 12}).toMillis()
                itemsObj["shield"].lastUse = last_use
                itemsObj["shield"].amount = parseInt(itemsObj["shield"].amount) - 1;
                await client.provider.updateProfile(message.guild!.id,message.author.id,{items: JSON.stringify(itemsObj)})
                await message.channel.send('Вы успешно использовали предмет **Щит для наличных**! Осталось в инвентаре: '+ itemsObj["shield"].amount)
                break
            case "4":
                if(itemsObj["lotery"].amount == 0) return await message.channel.send('У вас нет предмета **Лотерея** что бы использовать его!')
                if(itemsObj["lotery"].lastUse !== null) {
                    const k: number = itemsObj["lotery"].lastUse - DateTime.fromJSDate(new Date()).toMillis();
                    return await message.channel.send(`Вы недавно использовали предмет **Лотерея**! Попробуйте снова через: \`${humanizeDuration(k,{language: "ru", delimiter: " и ", largest: 2, round: true})}\``)
                }
                last_use = DateTime.fromJSDate(new Date()).plus({hours: 4}).toMillis()
                itemsObj["lotery"].lastUse = last_use
                itemsObj["lotery"].amount = parseInt(itemsObj["lotery"].amount) - 1;
                await client.provider.updateProfile(message.guild!.id,message.author.id,{items: JSON.stringify(itemsObj)})
                const chance = new Chance();
                let win;
                if(chance.bool({likelihood: 80})) {
                    win = await client.provider.getRandomInt(100, 5000)
                } else if(chance.bool({likelihood: 40})) {
                    win = await client.provider.getRandomInt(5000, 25000)
                } else if(chance.bool({likelihood: 30})) {
                    win = await client.provider.getRandomInt(25000, 65000)
                } else if(chance.bool({likelihood: 10}) ) {
                win = await client.provider.getRandomInt(65000, 80000)
                } else if(chance.bool({likelihood: 5})) {
                    win = 100000;
                    await message.channel.send('Вы сорвали **джекпот!!!**')
                } else {
                   return await message.channel.send('Повезет в следующий раз! :(')
                }
                await message.channel.send('Вы успешно использовали предмет **Лотерея**! Осталось в инвентаре: '+ itemsObj["lotery"].amount)
                await message.channel.send('Вам сегодня повезло на ' + win + ' монет!')
                await client.provider.updateProfile(message.guild!.id,message.author.id,{coins: profile.coins + win})
                break
            default:
                await message.channel.send('Нет предмета с таким идентификатором!')
        }
    }
}

export = Use;