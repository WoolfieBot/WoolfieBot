import {WoolfieClient} from "../../domain/WoolfieClient";
import {Guild} from "discord.js";
import WoolfieLogger from "../../domain/WoolfieLogger";

export = async(client: WoolfieClient, oldGuild: Guild, newGuild: Guild): Promise<void> => {
    if(newGuild.name != oldGuild.name) {
        await client.provider.updateGuild(newGuild.id,{guildName: newGuild.name})
    }

    if(oldGuild.afkChannelID != newGuild.afkChannelID) {
        let audit = await newGuild.fetchAuditLogs({
            type: "GUILD_UPDATE"
        })
        if(audit.entries.first()?.executor.bot) return
        let user = audit.entries.first()?.executor;
        await new WoolfieLogger({
            producer: user,
            guildID: newGuild.id,
            type: "srvupd",
            actionType: "Канал для AFK был изменён",
            description: `🚪 Старый канал для AFK:\`\`\`${oldGuild.afkChannel === null ? "Нет канала для AFK" : oldGuild.afkChannel.name}\`\`\`\n🚪 Новый канал для AFK:\`\`\`${newGuild.afkChannel === null ? "Канал для AFK удалён" : newGuild.afkChannel.name}\`\`\``
        }).Logger();
    }

    if(oldGuild.name != newGuild.name) {
        let audit = await newGuild.fetchAuditLogs({
            type: "GUILD_UPDATE"
        })
        if(audit.entries.first()?.executor.bot) return
        let user = audit.entries.first()?.executor;
        await new WoolfieLogger({
            producer: user,
            guildID: newGuild.id,
            type: "srvupd",
            actionType: "Название сервера было изменено",
            description: `📤 Старое название:\`\`\`${oldGuild.name}\`\`\`\n📤 Новое название:\`\`\`${newGuild.name}\`\`\``
        }).Logger();
    }

    if(oldGuild.iconURL() != newGuild.iconURL()) {
        let audit = await newGuild.fetchAuditLogs({
            type: "GUILD_UPDATE"
        })
        if(audit.entries.first()?.executor.bot) return
        let user = audit.entries.first()?.executor;
        await new WoolfieLogger({
            producer: user,
            guildID: newGuild.id,
            type: "srvupd",
            actionType: "Аватар сервера был изменён",
            description: `🖼️ Старый аватар:\`\`\`${oldGuild.iconURL() === null ? "Нет аватара сервера" : oldGuild.iconURL()}\`\`\`\n🖼️ Новый аватар:\`\`\`${newGuild.iconURL() === null ? "Аватар сервера удалён" : newGuild.iconURL()}\`\`\``
        }).Logger();
    }
}