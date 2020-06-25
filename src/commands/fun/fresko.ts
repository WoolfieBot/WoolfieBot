import { Command } from "../../domain/Command";
import {Message, MessageAttachment} from "discord.js";
import * as Canvas from "canvas";

class Fresko extends Command {
    constructor() {
        super({
            name: "fresko",
            description: "Команда с помощью которой вы можете создать цитату великого дизайнера и по совместительству инженера, который покорил мир своими монологами! <:fresko:709482199124279438>",
            aliases: ["fr"],
            category: "fun",
            usage: ">fresko [Текст цитаты]"
        });
    }

    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``);
        const text = args.join(" ");
        if(text.length > 300) return message.channel.send(`Максимальное количество символов для цитаты 300!`);
        const canvas = Canvas.createCanvas(567, 281)
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/595711225195659304/709488813705265182/fresko.png');
        const width = 370,
            fontFamily = "Times New Roman",
            fontSize = "18px",
            fontColour = "black";

        function fragmentText(text: any, maxWidth: any) {
            let words = text.split(' '),
                lines = [],
                line = "";
            if (ctx.measureText(text).width < maxWidth) {
                return [text];
            }
            while (words.length > 0) {
                while (ctx.measureText(words[0]).width >= maxWidth) {
                    const tmp = words[0];
                    words[0] = tmp.slice(0, -1);
                    if (words.length > 1) {
                        words[1] = tmp.slice(-1) + words[1];
                    } else {
                        words.push(tmp.slice(-1));
                    }
                }
                if (ctx.measureText(line + words[0]).width < maxWidth) {
                    line += words.shift() + " ";
                } else {
                    // @ts-ignore
                    lines.push(line);
                    line = "";
                }
                if (words.length === 0) {
                    // @ts-ignore
                    lines.push(line);
                }
            }
            return lines;
        }
        function draw() {
            ctx.font = "regular " + fontSize + " " + fontFamily;
            ctx.textAlign = "center";
            ctx.fillStyle = fontColour;
            const lines = fragmentText(text, width - parseInt(fontSize, 0));
            lines.forEach(function(line, i) {
                ctx.fillText(line, width / 2, (i + 2.5) * parseInt(fontSize,0));
            });
            ctx.restore();
        }
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        draw();
        ctx.textAlign = "center";
        ctx.fillText("— Жак Фреско —", canvas.width / 3.1, canvas.height / 1.3)
        const attachment = new MessageAttachment(canvas.toBuffer(), 'fresko.png');
        await message.channel.send(attachment);
    }
}

export = Fresko;
