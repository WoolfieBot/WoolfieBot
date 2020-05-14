import { Command } from "../../domain/Command";
import {GuildMember, Message} from "discord.js";
import { client } from "../../main";
import ms from "ms";
import {DateTime} from "luxon";
import {parentPort} from "worker_threads";

class Ban extends Command {
    constructor(){
        super({
            name: "ban",
            usage: ">ban [Упоминание или ник пользователя] [Причина]",
            description: "ПИЗДЕЦ НАХУЙ БАААААН БЛЯТЬ ДА СУКА БАН НАХУЙ БААААН",
            category: "moderation"
        });
    }
    
    async run(message: Message, args: Array<string>) {
        if(!message.member?.hasPermission("BAN_MEMBERS") && !message.member?.hasPermission("ADMINISTRATOR") && !await client.provider.ifModerRole(message.guild!.id, message.author.id) && !await client.provider.ifAdminRole(message.guild!.id, message.author.id)) return message.channel.send(`У вас недостаточно прав для использования данной команды!`);
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        let member: GuildMember = await client.provider.getMember(message,args[0]);
        if(member?.hasPermission("ADMINISTRATOR") || await client.provider.ifModerRole(message.guild!.id, member.id) || await client.provider.ifAdminRole(message.guild!.id, member.id)) return message.channel.send('Вы не можете забанить себя либо другого модератора / администратора!')

        let reason: string;
        let duration: string;
        let delMsgDays: number;
        try {
            if(!args[1]) {
                await member.ban();
                await client.provider.createPunisment(message.guild!.id,member.id,message.author.id,"BAN","Без причины", DateTime.fromMillis(0).toISO())
                return message.channel.send("Пользователь успешно забанен!");
            }
            if(!/[0-9]/.test(args[1]) && !/[0-9]/.test(args[2])) {
                reason = args.slice(1).join(" ");
                await member.ban({reason: reason});
                await client.provider.createPunisment(message.guild!.id,member.id,message.author.id,"BAN",reason, DateTime.fromMillis(0).toISO())
                return message.channel.send("Пользователь успешно забанен!");
            }
            if(!isNaN(Number(args[1])) && isNaN(Number(args[2]))){
                reason = args.slice(2).join(" ");
                delMsgDays = parseInt(args[1]);
                if(delMsgDays > 7) return message.channel.send("Удалить сообщения можно не больше чем за 7 дней до бана!")
                await member.ban({reason: reason, days: delMsgDays});
                await client.provider.createPunisment(message.guild!.id,member.id,message.author.id,"BAN",reason, DateTime.fromMillis(0).toISO())
                return message.channel.send("Пользователь успешно забанен!");
            }
            reason = args.slice(3).join(" ");
            duration = args[1];
            delMsgDays = parseInt(args[2]);
            await member.ban({reason: reason, days: delMsgDays})
            if(!duration.includes("d")) return message.channel.send("Можно банить только на дни! Пример: 1d, 2d, 3d, 4d ...")
            if(delMsgDays > 7) return message.channel.send("Удалить сообщения можно не больше чем за 7 дней до бана!")
            await client.provider.createPunisment(message.guild!.id,member.id,message.author.id,"TEMPBAN",reason, DateTime.fromJSDate(new Date()).plus({milliseconds: ms(duration)}).toISO())
            return message.channel.send("Пользователь успешно забанен!");
        } catch (error) {
            return message.channel.send(`Произошла ошибка при выполненни команды, проверьте правильность написания!\`\`\` > help ${this.name}\`\`\``)
        }
    }

}

export = Ban;