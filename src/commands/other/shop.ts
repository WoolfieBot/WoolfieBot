import {Command} from "../../domain/Command";
import {Message, MessageEmbed} from "discord.js";
import {client} from "../../main";
import {DateTime} from "luxon";
import humanizeDuration from "humanize-duration";
import {GuildObject} from "../../domain/ObjectModels";
import items from "../../assets/items.json";

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
        // Проверка включен ли ранкинг
        const guild: GuildObject = await client.provider.getGuild(message.guild!.id);
        if(guild.isLvl === 0) return message.channel.send(`На данном сервере отключён ранкинг.`);

        const profile = await client.provider.getProfile(message.guild!.id, message.author.id);
        let itemOfDay;

        let index: number = 2;
        let string: string = "";

        for (let itemsKey in items) {
            if(items.hasOwnProperty(itemsKey)) {
                if (itemsKey == "bank_upgrade") items[itemsKey].upgradeCost = Math.floor(items[itemsKey].cost + (5000 * profile.bankLvl) * 1.40)

                if(items[itemsKey].isItemOfDay) {
                    itemOfDay = items[itemsKey]
                    continue;
                }

                string += `\`ID: ${index}\` ${items[itemsKey].name} **-** ***${itemsKey == "bank_upgrade" ? items[itemsKey].upgradeCost : items[itemsKey].cost } монет*** **-** ${items[itemsKey].description}`
                index++;
            }
        }

        const k: number = itemOfDay.updatedAt - DateTime.fromJSDate(new Date()).toMillis();

        const embed = new MessageEmbed()
            .setTitle('🛒 Магазин предметов')
            .setTimestamp()
            .setThumbnail(<string>client.user?.avatarURL({format: "png", size: 256}))
            .addField(`\`ID: 1\` Предмет дня (сбросится через \`${humanizeDuration(k,{language: "ru", delimiter: " и ", largest: 2, round: true})}\`)`,`${itemOfDay.name} ─ ***${itemOfDay.upgradeCost ? itemOfDay.upgradeCost - Math.floor( itemOfDay.upgradeCost / 100 * itemOfDay.sale): itemOfDay.cost - Math.floor( itemOfDay.cost / 100 * itemOfDay.sale)} монет!*** **([<:sale:714784321671790622>СКИДКА ${itemOfDay.sale}%!](https://www.youtube.com/watch?v=8avMLHvLwRQ))** ─ ${itemOfDay.description}`)
            .addField('Все доступные предметы', string)
            .setFooter('Что бы купить что-то, используйте команду buy <номер товара>')
        await message.channel.send(embed)
    }
}

export = Shop;