import {Message, TextChannel} from "discord.js";
import WoolfieLogger from "../../domain/WoolfieLogger";
import {WoolfieClient} from "../../domain/WoolfieClient";

export = async(client: WoolfieClient, message: Message): Promise<void> => {
    await new WoolfieLogger({
        type: "notify",
        actionType: "Удалено сообщение",
        guildID: message.guild!.id,
        description: `📧 Контент удалённого сообщения: \`\`\`${message.content}\`\`\``,
        producer: message.author,
        channel: <TextChannel>message.channel,
        footer: `ID сообщения: ${message.id}`
    }).Logger();
}