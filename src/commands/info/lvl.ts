import { client } from "../../main";
import { Command } from "../../domain/Command";
import { Message, MessageAttachment, GuildMember } from "discord.js";
import * as Canvas from "canvas";
import sequelize from "../../models/sequelize";
import { UserProfileData } from "../../domain/ObjectModels";

class Rank extends Command {
    constructor(){
        super({
            name: "rank",
            usage: ">rank",
            description: "Команда которая показывает ваш профиль левелинга на данном сервере.",
            category: "info",
            aliases: ["lvl","r"]
        });
    }    
    async run(message: Message, args: Array<string>) {
        var guild: any = await client.provider.getGuild(message.guild!.id);
        if(guild.isLvl === 0) return message.channel.send(`На данном сервере отключён ранкинг.`);
        const canvas = Canvas.createCanvas(700, 180);
        const ctx = canvas.getContext('2d');
        var member: GuildMember = await client.provider.getMember(message, args.join(" "));        
        var stats: UserProfileData = await client.provider.getProfile(message.guild!.id, member.id);
        var top: Array<UserProfileData> = await sequelize.models.profiles.findAll({where:{guildID:message.guild!.id}, order:[['lvl','DESC']]});
        var check = (element: UserProfileData) => element.userID == member.id;
        
        if(stats === null){
            const roles: any = member?.roles.cache
                .filter((r: any) => r.id !== message.guild?.id)
                .map((r:any) => r.id).join(", ") || 'none';
            
            await client.provider.createProfile(message.guild!.id,member.id,member.user.username,member!.displayName,roles)
            stats = await client.provider.getProfile(message.guild!.id,member.id)
        }

        Canvas.registerFont('assets/fonts/VAG.otf',{ family: 'VAG World' });

        const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/595711225195659304/658060237663895552/asdsadf.jpg');

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(100,150,185,0.5)";
        roundRect(ctx,canvas.width / 3.5, canvas.height / 1.4,canvas.width / 1.5,canvas.height / 4.2, 30).fill();
        ctx.fillStyle = "rgba(56,137,228,1)";
        let xpToNextLvl = Math.floor(100 + 100 * 2.981 * (stats.lvl + 1));
        let progress = Math.floor(canvas.width / 1.5 * stats.xp / xpToNextLvl);
        progress < 35 ? progress = 35 : progress;
        progress > canvas.width / 1.5 ? progress = canvas.width / 1.5 : progress;
        roundRect(ctx,canvas.width / 3.5, canvas.height / 1.4, progress, canvas.height / 4.2, 30).fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px "VAG World"';
        ctx.textAlign = "left"; 
        ctx.fillText(member.displayName, canvas.width / 3.2, canvas.height / 3)
        ctx.textAlign = "center"; 
        ctx.font = 'bold 20px "VAG World"';
        ctx.fillText(stats.xp + "/" + xpToNextLvl, canvas.width / 1.55, canvas.height / 1.15)
        ctx.font = 'bold 20x "VAG World"';
        ctx.textAlign = "left";
        ctx.fillText("#" + (top.findIndex(check) + 1) + " Ранг " + stats.lvl + " Ур. " + stats.reputation + " 🍖",canvas.width / 3.2,canvas.height / 1.46)
        ctx.beginPath();
        ctx.arc(93, 93, 73, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format:'png'}));
        const status = await Canvas.loadImage('https://media.discordapp.net/attachments/720287261098508338/727832871175454780/online.png');
        ctx.drawImage(avatar, 20, 20, 150, 150);
        const attachment = new MessageAttachment(canvas.toBuffer(), 'ranking.png');        
        await message.channel.send(attachment);
    }
}

function roundRect(ctx: Canvas.CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): Canvas.CanvasRenderingContext2D {
    if(w < 2 * r) r = w / 2;
    if(h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y,   x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x,   y+h, r);
    ctx.arcTo(x,   y+h, x,   y,   r);
    ctx.arcTo(x,   y,   x+w, y,   r);
    ctx.closePath();
    return ctx;
}

export = Rank;