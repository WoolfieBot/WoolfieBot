import {Command} from "../../domain/Command";
import {GuildMember, Message, Role} from "discord.js";
import {client} from "../../main";

class Unmute extends Command {
    constructor() {
        super({
            name: "unmute",
            description: "Команда для модерации/администрации с помощью которой вы можете отозвать право писать сообщения на вашем сервере у любого пользователя, на время или навсегда.",
            category: "moderation",
            usage: ">unmute <Упоминание пользователя | Никнейм пользователя>"
        });
    }

    async run(message: Message, args: Array<string>) {
        if(!message.member?.hasPermission("MANAGE_MESSAGES") && !message.member?.hasPermission("ADMINISTRATOR") && !await client.provider.ifModerRole(message.guild!.id, message.author.id) && !await client.provider.ifAdminRole(message.guild!.id, message.author.id)) return message.channel.send(`У вас недостаточно прав для использования данной команды!`);
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``);
        let member: GuildMember = await client.provider.getMember(message,args[0]);
        if(member?.hasPermission("ADMINISTRATOR") || await client.provider.ifModerRole(message.guild!.id, member.id) || await client.provider.ifAdminRole(message.guild!.id, member.id)) return message.channel.send('Вы не можете замутить себя либо другого модератора / администратора!');
        let muteRole = message.guild?.roles.cache.find(role => role.name == 'WFMUTED');

        if(!member.roles.cache.has(muteRole!.id) && !await client.provider.getUserActivePunishment(message.guild!.id, "TEMPMUTE", member.id) && !await client.provider.getUserActivePunishment(message.guild!.id, "MUTE", member.id)) return message.channel.send("Пользователь не имеет активных мутов!");

        await client.provider.updateUserActivePunishment(message.guild!.id,"TEMPMUTE",member.id,{active: 0})
        await client.provider.updateUserActivePunishment(message.guild!.id,"MUTE",member.id,{active: 0})

        if(member.roles.cache.has(muteRole!.id)) {
            await member.roles.remove(<Role>muteRole);
        }

        await message.channel.send("Пользователь успешно размучен!")
    }
}

export = Unmute;