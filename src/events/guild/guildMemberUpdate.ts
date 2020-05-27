import { WoolfieClient } from "../../domain/WoolfieClient";
import { GuildMember} from "discord.js";

export = async(client: WoolfieClient, oldMember: GuildMember, newMember: GuildMember): Promise<void> => {
    if(!oldMember.user.bot) {
        if(newMember.roles.cache != oldMember.roles.cache) {
            const roles = newMember.roles.cache
                .filter(r => r.id !== newMember.guild?.id)
                .map(r => r.id).join(",") || 'none';
            await client.provider.updateProfile(newMember.guild.id,newMember.id,{roles: roles})
        }
        if(newMember.displayName != oldMember.displayName) {
            let displayName = newMember.displayName;
            if(displayName == newMember.user.username) displayName = 'none';
            await client.provider.updateProfile(newMember.guild.id,newMember.id,{userDisplayName: displayName})
        }
    }
}