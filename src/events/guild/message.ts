import {Message, MessageEmbed, Role, TextChannel} from "discord.js";
import { WoolfieClient } from "../../domain/WoolfieClient";
import {GuildObject, UserProfileData} from "../../domain/ObjectModels";

export = async (client: WoolfieClient, message: Message): Promise<void> => {
    if(message.author.bot) return;
    if(message.guild == null) return;

    let settings: GuildObject;
    try {
        settings = await client.provider.getGuild(message.guild.id)
    } catch (error) {
        return console.log(error)
    }

    let profile: UserProfileData;
    try {
        profile = await client.provider.getProfile(message.guild.id,message.author.id)
    } catch (error) {
        return console.log(error)
    }

    if(profile == null) {
        const roles = message.member?.roles.cache
        .filter(r => r.id !== message.guild?.id)
        .map(r => r.id).join(",") || 'none';
        let displayName = message.member!.displayName;
        if(displayName == message.author.username) displayName = 'none';
        await client.provider.createProfile(message.guild.id,message.author.id,message.author.username,displayName,roles)
        profile = await client.provider.getProfile(message.guild.id,message.author.id)
        console.log('Зарегестрирован новый пользователь ' + displayName + '. ' + __filename)
    }
    
    if(!message.member) await message.guild.members.fetch(message)

    let punishmentTemp = await client.provider.getUserActivePunishment(message.guild!.id, "TEMPMUTE", message.author.id)
    let punishmentPerm = await client.provider.getUserActivePunishment(message.guild!.id, "MUTE", message.author.id)

    if(punishmentTemp) {
        if(message.guild.members.cache.get(punishmentTemp.punishableID)) {
            let role: Role = <Role>message.guild.roles.cache.find(x => x.name == "WFMUTED")
            if(role) {
                await message.delete();
                return
            }
        }
    }

    if(punishmentPerm) {
        if(message.guild.members.cache.get(punishmentTemp.punishableID)) {
            let role: Role = <Role>message.guild.roles.cache.find(x => x.name == "WFMUTED")
            if(role) {
                await message.delete();
                return
            }
        }
    }
  
    if(message.content.startsWith(settings.prefix)) {

    if(profile.isBlackListed == 1) {
        await message.channel.send(`Вы были добавлены в чёрный список бота.`)
        return
    }
    
    if(settings.isBlackListed == 1) {
        await message.channel.send(`Этот сервер был добавлен в чёрный список бота.`)
        return
    }

    const args: Array<string> = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const cmd: string = args.shift()!.toLowerCase();

    let command;

        if(cmd.length === 0) return;

        if(client.commands.has(cmd)) {
            command = client.commands.get(cmd);
        }

        if(client.aliases.has(cmd)) {
            command = client.aliases.get(cmd)
        }

        if(command) {
            command.run(message, args, cmd, client);
        }

    }

    if(settings.isLvl == 1){
        const messageCheckXp: number = await client.provider.getRandomInt(1, 13);

        const toUpdate = {
            xp: 0,
            coins: 0,
            lvl: 0
        };

        if(messageCheckXp >= 2 && messageCheckXp <= 7) {

            toUpdate.xp = await client.provider.getRandomInt(15, 45);
            toUpdate.coins = await client.provider.getRandomInt(1, 8);

            if(profile.xp >= Math.floor(100 + 100 * 2.891 * profile.lvl + 1)) {
                let channel: TextChannel = <TextChannel>message.guild.channels.cache.find(ch => ch.id == settings.lvlUpChannel)
                let text: string = client.provider.format({lvl:profile.lvl + 1,text:settings.lvlUpMsg, username: message.member?.displayName, user_mention: message.author.id, guild_name: message.guild.name})

                toUpdate.lvl = toUpdate.lvl + 1

                if(settings.lvlUpEmbed == 1) {
                    let embed = new MessageEmbed()
                        .setDescription(text)
                    channel?.send(embed)
                }else{
                    channel?.send(text)
                }

                await client.provider.updateProfile(message.guild.id,message.author.id,{xp:"0"})
                await client.provider.updateRanks(message.guild.id,message.author.id,toUpdate)

                return
            }

            await client.provider.updateRanks(message.guild.id,message.author.id,toUpdate)
        }
    }
}