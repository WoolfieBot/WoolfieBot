import {WoolfieClient} from "../../domain/WoolfieClient";
import {GuildMember, MessageEmbed, TextChannel} from "discord.js";
import {GuildObject, UserProfileData} from "../../domain/ObjectModels";

export = async (client: WoolfieClient, member: GuildMember): Promise<void> => {
    if(!member.user.bot) {
        const guild: GuildObject = await client.provider.getGuild(member.guild.id)
        const profile: UserProfileData = await client.provider.getProfile(member.guild.id, member.id)
        if(profile) {
            if(guild.isSaveInfo == 1) {
                if(profile.roles != "none") {
                    for (const x of profile.roles.split(",")) {
                        let role = member.guild.roles.cache.get(x)
                        if(role) {
                            try { await member.roles.add(role) } catch {}
                        }
                    }
                }
                if(profile.userDisplayName != "none") {
                    await member.setNickname(profile.userDisplayName)
                }
            }
        } else {
            await client.provider.createProfile(member.guild.id,member.id,member.user.username,"none","none")
        }

        let channel = <TextChannel>member.guild.channels.cache.get(guild.welcomeChannel)
        await channel.send(new MessageEmbed().setDescription(client.provider.format({text: guild.welcomeMsg, user_mention: member.id, username: member.displayName, guild_name: member.guild.name})))
    }
}