import {Command} from "../../domain/Command";
import {Message} from "discord.js";
import {client} from "../../main";

class Buy extends Command {
    constructor() {
        super({
            name: "buy",
            description: "Команда для покупки предметов из магазина (см. >help shop)",
            category: "other",
            usage: ">buy <ID Предмета>"
        });
    }

    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        const profile = await client.provider.getProfile(message.guild!.id, message.author.id)

        switch (args[0]) {
            case "1":
                if(profile.coins < 2000) return message.channel.send("Недостаточно наличных для совершения покупки!")
                    let objBoost = JSON.parse(profile.items)
                    objBoost.xp_boost.amount = parseInt(objBoost.xp_boost.amount) + 1;
                    await client.provider.updateProfile(message.guild!.id, message.author.id, {items: JSON.stringify(objBoost), coins: profile.coins - 2000})
                    await message.channel.send('Вы успешно купили предмет **Бустер опыта**! Количество в инвентаре: ' + objBoost.xp_boost.amount)
                break
            case "2":
                if(profile.coins < 10000) return message.channel.send("Недостаточно наличных для совершения покупки!")
                    let objShield = JSON.parse(profile.items)
                    if(objShield.shield.amount >= 1) return message.channel.send('Нельзя иметь больше 1 щита для наличных! Используйте уже имеющийся.')
                    objShield.shield.amount = parseInt(objShield.shield.amount) + 1;
                    await client.provider.updateProfile(message.guild!.id, message.author.id, {items: JSON.stringify(objShield), coins: profile.coins - 10000})
                    await message.channel.send('Вы успешно купили предмет **Щит для наличных**! Количество в инвентаре: ' + objShield.shield.amount)
                break
            case "3":
                if(profile.coins < 10000 + (5000 * profile.bankLvl) * 1.40) return message.channel.send("Недостаточно наличных для совершения покупки!")
                    await client.provider.updateProfile(message.guild!.id,message.author.id,{coins: profile.coins - 10000 + (5000 * profile.bankLvl) * 1.40})
                    await client.provider.updateRanks(message.guild!.id,message.author.id,{bankLvl: 1})
                    await message.channel.send('Вы успешно купили улучшение **Улучшение банка**! Текущий уровень: ' + Math.floor(profile.bankLvl + 1))
                break
            case "4":
                if(profile.coins < 5000) return message.channel.send("Недостаточно наличных для совершения покупки!")
                    let objLotery = JSON.parse(profile.items)
                    objLotery.lotery.amount = parseInt(objLotery.lotery.amount) + 1;
                    await client.provider.updateProfile(message.guild!.id, message.author.id, {items: JSON.stringify(objLotery), coins: profile.coins - 5000})
                    await message.channel.send('Вы успешно купили предмет **Лотерея**! Количество в инвентаре: ' + objLotery.lotery.amount)
                break
            case "5":
                if(profile.coins < 8000) return message.channel.send("Недостаточно наличных для совершения покупки!")
                let objReverse = JSON.parse(profile.items)
                objReverse.reverse_card.amount = parseInt(objReverse.reverse_card.amount) + 1;
                await client.provider.updateProfile(message.guild!.id, message.author.id, {items: JSON.stringify(objReverse), coins: profile.coins - 8000})
                await message.channel.send('Вы успешно купили предмет **Карта возврата**! Количество в инвентаре: ' + objReverse.reverse_card.amount)
                break
            case "6":
                return message.channel.send('Предмета с таким идентификатором не существует!')
                break
            default:
                return message.channel.send('Предмета с таким идентификатором не существует!')
        }
    }
}

export = Buy;