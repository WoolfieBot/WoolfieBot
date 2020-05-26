import {Command} from "../../domain/Command";
import {Message} from "discord.js";
const translate = require("translate");

class Translate extends Command {
    constructor() {
        super({
            name: "translate",
            usage: ">translate <Язык с которого перевести> <Язык на который перевести> [Текст]",
            description: "Простая команда для перевода на любые языки, указывать языки нужно в формате ISO 639-1",
            category: "fun",
            aliases: ["tr", "trans"]
        });
    }

    async run(message: Message, args: string[]) {
        let from = args[0]
        let to = args[1]
        let text = args.slice(2).join(" ");
        if (!from) return message.channel.send(`Укажите язык с которого нужно перевести!`);
        if (!to) return message.channel.send(`Укажите на какой язык нужно перевести!`);
        if (!text) return message.channel.send(`Нельзя перевести воздух!`)
        try {
            translate(`${text}`, { from: `${from}`, to: `${to}`, engine: 'yandex', key: `${process.env.apikey}` }).then((text: any) => {
                message.channel.send(text);
            });
        } catch (error) {
            await message.channel.send(`Произошла ошибка во время выполнения команды: \`${error.message}\``)
        }
    }
}

export = Translate;