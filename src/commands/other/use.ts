import {Command} from "../../domain/Command";
import {Message} from "discord.js";
import {client} from "../../main";
import {DateTime} from "luxon";
import humanizeDuration from "humanize-duration";

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
        let itemsObj = JSON.parse(`{${profile.items}}`)
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
                await client.provider.updateProfile(message.guild!.id,message.author.id,{items:JSON.stringify(itemsObj).substr(1, JSON.stringify(itemsObj).length - 2)})
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
                await client.provider.updateProfile(message.guild!.id,message.author.id,{items:JSON.stringify(itemsObj).substr(1, JSON.stringify(itemsObj).length - 2)})
                await message.channel.send('Вы успешно использовали предмет **Щит для наличных**! Осталось в инвентаре: '+ itemsObj["shield"].amount)
                break
            default:
                await message.channel.send('Нет предмета с таким идентификатором!')
        }
    }
}

export = Use;