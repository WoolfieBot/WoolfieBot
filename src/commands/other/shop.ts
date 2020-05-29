import {Command} from "../../domain/Command";
import {Message, MessageEmbed} from "discord.js";
import {client} from "../../main";
import {DateTime} from "luxon";
import humanizeDuration from "humanize-duration";

class Shop extends Command {
    constructor() {
        super({
            name: "shop",
            description: "Команда для просмотра и покупки предметов в магазине, от апгрейдов до безделушек.",
            category: "other",
            usage: ">shop"
        });
    }

    async run(message: Message, args: Array<string>) {
        const profile = await client.provider.getProfile(message.guild!.id, message.author.id)
        const guild = await client.provider.getGuild(message.guild!.id)
        let obj;
        if(guild.itemOfDay == null) {
            let namesArr = ["xp_boost","shield","lotery","reverse_card"];
            let random = namesArr[Math.floor(Math.random() * namesArr.length)];
            let time = DateTime.fromJSDate(new Date()).plus({hours: 24}).toMillis()
            await client.provider.updateGuild(message.guild!.id,{itemOfDay: `{"itemOfDay":{"name":"${random}","update":${time}}}`})
        } else {
            obj = JSON.parse(<string>guild.itemOfDay)
        }

        const k: number = obj.itemOfDay.update - DateTime.fromJSDate(new Date()).toMillis();
        const embed = new MessageEmbed()
            .setTitle('🛒 Магазин предметов')
            .setTimestamp()
            .setThumbnail(<string>client.user?.avatarURL({format: "png", size: 256}))
            .addField(`Предмет дня (сбросится через \`${humanizeDuration(k,{language: "ru", delimiter: " и ", largest: 2, round: true})}\`)`,`**${obj.itemOfDay.name}** ─ ***228 монет!*** **([<:sale:714784321671790622>СКИДКА 54%!](https://www.youtube.com/watch?v=ReJ6yiUtq5k))** ─ используемый\nПросто мать део, можете использовать как посудомойку или еще что-то!`)
            .addField('Все доступные предметы',`\`ID: 1\` 🔱 **Бустер опыта** ─ ***2.000 монет*** ─ *коллекционный*\nПри активации дает небольшой буст опыта в размере x1.5 на 8 часов\n\n\`ID: 2\` 🛡️ **Щит для наличных** ─ ***10.000 монет*** ─ *используемый*\nЩит который защитит вас от карманных воров на 12 часов! *Нельзя использовать несколько за раз и хранить больше 1 шт. в инвентаре!*\n\n\`ID: 3\` 🏦 **Улучшение банка** ─ ***${10000 + (5000 * profile.bankLvl) * 1.40} монет*** ─ *улучшение*\nУвеличивает ваш уровень банка, что позволяет хранить в нем больше наличных! *С каждым уровнем цена на улучшение растет*\n\n\`ID: 4\` 🎫 **Лотерея** ─ ***5.000 монет*** ─ *коллекционный*\nЛотерея в которой можно испытать удачу раз в 4 часа, вы можете получить от 100 монет до джекпота в 100 тысяч!\n\n\`ID: 5\`<:reverse:714826042631520317> **Карта возврата** ─ ***8.000 монет***  ─ коллекционный\nХочешь отомстить надоедливым ворам? После покупки предмета, когда у вас воруют будет 5 минут на то, что бы использовать этот предмет который возвратит кражу в сторону вора! *Можно использовать раз в 6 часов*`)
            .setFooter('Что бы купить что-то, используйте команду buy <номер товара>')
        await message.channel.send(embed)
    }
}

export = Shop;