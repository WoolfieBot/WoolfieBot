import { client } from "../../main";
import { WoolfieClient } from "../../domain/WoolfieClient";
import { Guild, TextChannel } from "discord.js";

export = async(client: WoolfieClient, guild: Guild): Promise<void> => {
    let channelID;
    let channels: any = guild.channels.cache;
    channelLoop:
    for (let c of channels) {
        let channelType = c[1].type;
        if (channelType === "text") {
            channelID = c[0];
            break channelLoop;
        }
    }
    let channel: TextChannel = <TextChannel>client.channels.cache.get(guild.systemChannelID || channelID);
    channel.send(`:)`);
    await client.provider.createGuild(guild.id,guild.name,"Добро пожаловать на сервер!",channelID,"Ну получил новый лвл, и чо чо бухтеть-то",channelID)
}