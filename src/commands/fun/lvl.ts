import { client } from "../../main";
import { Command } from "../../domain/Command";
import { Message, MessageAttachment } from "discord.js";
import * as Canvas from "canvas";

class Rank extends Command {
    constructor(){
        super({
            name: "rank",
            usage: ">rank",
            description: "Команда которая показывает ваш профиль левелинга на данном сервере.",
            category: "fun",
            aliases: ["lvl","r"]
        });
    }
    
    async run(message: Message, args: Array<string>) {
        const canvas = Canvas.createCanvas(700, 180)
        const ctx = canvas.getContext('2d');
        var member = await client.provider.getMember(message, args.join(" "));        
        const stats = await client.provider.getProfile(message.guild!.id, member.id)
        //@ts-ignore
        ctx.roundRect = function(x: number, y: number, w: number, h: number, r: number): any {
            if(w < 2 * r) r = w / 2;
            if(h < 2 * r) r = h / 2;
            this.beginPath();
            this.moveTo(x+r, y);
            this.arcTo(x+w, y,   x+w, y+h, r);
            this.arcTo(x+w, y+h, x,   y+h, r);
            this.arcTo(x,   y+h, x,   y,   r);
            this.arcTo(x,   y,   x+w, y,   r);
            this.closePath();
            return this;
        }        
        const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/595711225195659304/658060237663895552/asdsadf.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(100,150,185,0.5)";
        //@ts-ignore
        ctx.roundRect(canvas.width / 3.5,canvas.height / 1.4,canvas.width / 1.5,canvas.height / 4.2, 30).fill();
        ctx.fillStyle = "rgba(56,137,228,1)";
        const tavo = Math.floor(100 + 100 * 2.981 * (stats.lvl + 1))
        var kavo = Math.floor(canvas.width / 1.5 * stats.xp / tavo)
        if(kavo < 35){
            kavo = 35
        }
        //@ts-ignore
        ctx.roundRect(canvas.width / 3.5,canvas.height / 1.4,kavo,canvas.height / 4.2, 30).fill();
        ctx.beginPath();
        ctx.arc(93, 93, 73, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format:'png'}));
        ctx.drawImage(avatar, 20, 20, 150, 150);
        const attachment = new MessageAttachment(canvas.toBuffer(), 'ranking.png');
        
        message.channel.send(attachment);
    }
}

export = Rank;