import { Message, MessageEmbed } from "discord.js";
import { WoolfieClient } from "../../domain/WoolfieClient";
const Enmap = require('enmap')
const ops = new Enmap({name: 'test'})

export = async (client: WoolfieClient, message: Message): Promise<void> => {
    if(message.author.bot) return;
    if(message.guild == null) return;

    var settings: any;
    try {
        settings = await client.provider.getGuild(message.guild.id)
    } catch (error) {
        return console.log(error)
    }
    var profile;
    try {
        profile = await client.provider.getProfile(message.guild.id,message.author.id)
    } catch (error) {
        return console.log(error)
    }
    if(profile == null){
        const roles = message.member?.roles.cache
        .filter(r => r.id !== message.guild?.id)
        .map(r => r).join(", ") || 'none';
        await client.provider.createProfile(message.guild.id,message.author.id,message.author.username,message.member!.displayName,roles)
        profile = await client.provider.getProfile(message.guild.id,message.author.id)
    }
    
    if(!message.member) message.guild.members.fetch(message)
    
    if(message.content.startsWith(settings.prefix)){
    const args: Array<string> = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const cmd: string = args.shift()!.toLowerCase();
    let command;
    if(cmd.length === 0) return;
    if(client.commands.has(cmd)){
        command = client.commands.get(cmd);
    }
    if(client.aliases.has(cmd)){
        command = client.aliases.get(cmd)
    }
    if(command) {
        command.run(message, args, cmd, ops);
    }
    }
    if(settings.isLvl == 1){
        var messageCheckXp: number = await client.provider.getRandomInt(1,15)
        var toUpdate = {
            xp: 0,
            coins: 0,
            lvl: 0
        }        
        if(messageCheckXp >= 2 && messageCheckXp <= 7){
            toUpdate.xp = await client.provider.getRandomInt(6,15)
            toUpdate.coins = await client.provider.getRandomInt(2,8)
            if(profile.xp >= Math.floor(100 + 100 * 2.891 * parseInt(profile.lvl) + 1)){
                let channel: any = message.guild.channels.cache.find(ch => ch.id == settings.lvlUpChannel)
                let text = settings.lvlUpMsg
                toUpdate.lvl = toUpdate.lvl + 1
                if(settings.lvlUpEmbed == "1"){
                    let embed = new MessageEmbed()
                        .setDescription(text)
                    channel.send(embed) 
                }else{
                channel.send(text)
                }
                await client.provider.updateProfile(message.guild.id,message.author.id,{xp:"0"})
                await client.provider.updateRanks(message.guild.id,message.author.id,toUpdate)
                return
            }
            await client.provider.updateRanks(message.guild.id,message.author.id,toUpdate)
        }
    }
}