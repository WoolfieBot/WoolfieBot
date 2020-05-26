import {Command} from "../../domain/Command";
import {Message, MessageEmbed} from "discord.js";
const randomPuppy = require('random-puppy');

class Weeb extends Command {
    constructor() {
        super({
            name: "weeb",
            usage: ">weeb",
            description: "Команда которая будет вашим лучшим другом. <:hehe:654365293522583583>",
            category: "fun"
        });
    }

    async run(message: Message, args: string[]) {
        const tags = ['dankmeme','me_irl','meme','anime', 'animemes']
        const random = tags[Math.floor(Math.random() * tags.length)];

        const img = await randomPuppy(random);
        await message.channel.send(
            new MessageEmbed()
                .setColor("RANDOM")
                .setImage(img)
                .setTimestamp()
                .setTitle(`Взято из /r/${random}`)
                .setURL(`https://reddit.com/r/${random}`)
        )
    }
}

export = Weeb;