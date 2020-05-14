import {Command} from "../../domain/Command";
import {GuildMember, Message, Role} from "discord.js";
import {client} from "../../main";
import {DateTime} from "luxon";
import ms from "ms";

class Mute extends Command {
    constructor() {
        super({
            name: "mute",
            description: "Команда для модерации/администрации с помощью которой вы можете отозвать право писать сообщения на вашем сервере у любого пользователя, на время или навсегда.",
            category: "moderation",
            usage: ">mute <Упоминание пользователя | Никнейм пользователя> [длительность] [причина], >mute <Упоминание пользователя | Никнейм пользователя> [причина], >mute <Упоминание пользователя | Никнейм пользователя>"
        });
    }

    async run(message: Message, args: Array<string>) {
        if(!message.member?.hasPermission("BAN_MEMBERS") && !message.member?.hasPermission("ADMINISTRATOR") && !await client.provider.ifModerRole(message.guild!.id, message.author.id) && !await client.provider.ifAdminRole(message.guild!.id, message.author.id)) return message.channel.send(`У вас недостаточно прав для использования данной команды!`);
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        let member: GuildMember = await client.provider.getMember(message,args[0]);
        if(member?.hasPermission("ADMINISTRATOR") || await client.provider.ifModerRole(message.guild!.id, member.id) || await client.provider.ifAdminRole(message.guild!.id, member.id)) return message.channel.send('Вы не можете замутить себя либо другого модератора / администратора!')

        let reason: string;
        let duration: string;
        let muteRole = message.guild?.roles.cache.find(role => role.name == 'WFMUTED');

        if(member.roles.cache.has(muteRole!.id) || await client.provider.getUserActivePunishment(message.guild!.id, "TEMPMUTE", member.id) || await client.provider.getUserActivePunishment(message.guild!.id, "MUTE", member.id)) return message.channel.send("Пользователь уже имеет активные муты!")

        try {
            if(!muteRole) {
                muteRole = await message.guild?.roles.create({ data:{
                        name: "WFMUTED",
                        color: "#000000",
                        permissions: []
                    },
                    reason: "MuteRole For WoolfieBot"
                })
                message.guild?.channels.cache.forEach((channel) => {
                    channel.updateOverwrite(<Role>muteRole,{
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                })
            }
            if(!args[1]) {
                await member.roles.add(<Role>muteRole);
                await client.provider.createPunisment(message.guild!.id,member.id,message.author.id,"MUTE","Без причины", DateTime.fromMillis(0).toISO());
                await message.channel.send('Пользователь теперь в муте!')
            }
            if(/[0-9]/.test(args[1])) {
                duration = args[1];
                reason = args.slice(2).join(" ");
                if(!duration.includes("d") && !duration.includes("s") && !duration.includes("m") && !duration.includes("h")) return message.channel.send("Можно банить только на дни, минуты, секунды или часы! Пример: 1d, 23m, 13s, 40h ...")
                await member.roles.add(<Role>muteRole);
                console.log(ms(duration))
                await client.provider.createPunisment(message.guild!.id,member.id,message.author.id,"TEMPMUTE", reason, DateTime.fromJSDate(new Date()).plus({milliseconds: ms(duration)}).toISO());
                await message.channel.send("Пользователь теперь в муте!")
            }
        } catch (e) {
            await message.channel.send(`Произошла ошибка при выполненни команды, проверьте правильность написания!\`\`\` >help ${this.name}\`\`\``)
        }
    }
}

export = Mute;