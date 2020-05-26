import {Command} from "../../domain/Command";
import {Message, MessageEmbed} from "discord.js";
import {client} from "../../main";

class Inventory extends Command {
    constructor() {
        super({
            name: "inventory",
            description: "Команда для проверки вашего инвентаря.",
            category: "other",
            aliases: ["inv", "items"],
            usage: ">inventory"
        });
    }

    async run(message: Message, args: Array<string>) {
        const profile = await client.provider.getProfile(message.guild!.id,message.author.id)
        let string: string = "";
        let obj: any = JSON.parse(`{${profile.items}}`)
        Object.keys(obj).forEach((x: any) => {
            if(obj[x].amount == 0) return
            string += `**${obj[x].name}** ─ ${obj[x].amount}\n\n`
        });
        if(string.length == 0) return message.channel.send('В вашем инвентаре нет предметов для отображения.')

        await message.channel.send(new MessageEmbed().setTitle(`👜 Инвентарь`).setTimestamp().setFooter('Что бы использовать предмет, используйте команду use <ID предмета>').addField('Все доступные предметы:', string))
    }
}

export = Inventory;