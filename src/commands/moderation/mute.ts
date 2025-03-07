import {Command} from "../../domain/Command";
import {GuildMember, Message, Role} from "discord.js";
import {client} from "../../main";
import {DateTime} from "luxon";
import ms from "ms";
import WoolfieLogger from "../../domain/WoolfieLogger";
import humanizeDuration, {humanizer} from "humanize-duration";

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
        if(!message.member?.hasPermission("MANAGE_MESSAGES") && !message.member?.hasPermission("ADMINISTRATOR") && !await client.provider.ifModerRole(message.guild!.id, message.author.id) && !await client.provider.ifAdminRole(message.guild!.id, message.author.id)) return message.channel.send(`У вас недостаточно прав для использования данной команды!`);
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
                await new WoolfieLogger({
                    type: "moderation",
                    actionType: "Выдан мут",
                    guildID: message.guild!.id,
                    punished: member,
                    producer: message.author,
                    description: `**Причина:** \`\`\`Без причины\`\`\`\n**Последнее сообщение пользователя:**\`\`\`${member.lastMessage?.content}\`\`\``
                }).Logger();
            }
            if(/[0-9]/.test(args[1])) {
                duration = args[1];
                reason = args.slice(2).join(" ");
                if(!duration.includes("d") && !duration.includes("s") && !duration.includes("m") && !duration.includes("h")) return message.channel.send("Можно банить только на дни, минуты, секунды или часы! Пример: 1d, 23m, 13s, 40h ...")
                await member.roles.add(<Role>muteRole);
                await client.provider.createPunisment(message.guild!.id,member.id,message.author.id,"TEMPMUTE", reason, DateTime.fromJSDate(new Date()).plus({milliseconds: ms(duration)}).toISO());
                unmute(member,<Role>muteRole,duration)
                await message.channel.send("Пользователь теперь в муте!")
                await new WoolfieLogger({
                    type: "moderation",
                    actionType: "Выдан мут",
                    guildID: message.guild!.id,
                    punished: member,
                    producer: message.author,
                    description: `**Причина:** \`\`\`${reason}\`\`\`\n**Длительность:**\`\`\`${humanizeDuration(ms(duration),{language: "ru", delimiter: " и ", largest: 2, round: true})}\`\`\`\n**Последнее сообщение пользователя:**\`\`\`${member.lastMessage?.id}\`\`\``
                }).Logger();
            }
            if(!/[0-9]/.test(args[1])) {
                reason = args.slice(1).join(" ");
                await member.roles.add(<Role>muteRole);
                await client.provider.createPunisment(message.guild!.id,member.id,message.author.id,"MUTE",reason, DateTime.fromMillis(0).toISO());
                await message.channel.send('Пользователь теперь в муте!')
                await new WoolfieLogger({
                    type: "moderation",
                    actionType: "Выдан мут",
                    guildID: message.guild!.id,
                    punished: member,
                    producer: message.author,
                    description: `**Причина:** \`\`\`${reason}\`\`\`\n**Последнее сообщение пользователя:**\`\`\`${member.lastMessage?.id}\`\`\``
                }).Logger();
            }
        } catch (e) {
            await message.channel.send(`Произошла ошибка при выполненни команды, проверьте правильность написания!\`\`\` >help ${this.name}\`\`\``)
        }
    }
}

function unmute(member: GuildMember, muteRole: Role, duration: string) {
    setTimeout(async () =>{
        if(!member.roles.cache.has(muteRole!.id) && !await client.provider.getUserActivePunishment(member.guild!.id, "TEMPMUTE", member.id) && !await client.provider.getUserActivePunishment(member.guild!.id, "MUTE", member.id)) return
        await client.provider.updateUserActivePunishment(member.guild!.id,"TEMPMUTE",member.id,{active: 0})
        await client.provider.updateUserActivePunishment(member.guild!.id,"MUTE",member.id,{active: 0})
        if(member.roles.cache.has(muteRole!.id)) {
            await member.roles.remove(<Role>muteRole);
        }
    }, ms(duration))
}

export = Mute;