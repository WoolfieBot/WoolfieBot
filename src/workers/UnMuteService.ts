import { schedule } from "node-cron";
import { SimpleWorker } from "./WorkerTemplate";
import { WoolfieClient } from "../domain/WoolfieClient";
import { PunishmentObject } from "../domain/ObjectModels";
import { DateTime } from "luxon";
import { Guild, GuildMember, Role } from "discord.js";
import sequelize from "../models/sequelize";

export class UnMuteWorker extends SimpleWorker {
    constructor(){
        super({
            name: "UnMuteWorker",
            timeMinute: 5
        })
    }
    
    async setWorker(client: WoolfieClient) {
        schedule('*/1 * * * *', async () => {
            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' UnMuteWorker: Начата проверка на валидность наказаний...');

            const punishmentsTemp: Array<PunishmentObject> | undefined = await client.provider.getActivePunishments("TEMPMUTE");
            const punishmentsPerm: Array<PunishmentObject> | undefined = await client.provider.getActivePunishments("MUTE");

            if(punishmentsPerm!.length > 0) {
                punishmentsPerm?.forEach(function (punishment: PunishmentObject) {
                    let guild: Guild;
                    guild = <Guild>client.guilds.cache.get(punishment.guildID);
                    if(guild.members.cache.get(punishment.punishableID)) {
                        let user: GuildMember = <GuildMember>guild.members.cache.get(punishment.punishableID);
                        let role: Role = <Role>guild.roles.cache.find(x => x.name == "WFMUTED")
                        if(role) {
                            if(!user.roles.cache.get(role.id)){
                                user.roles.add(role)
                            }
                        }
                    }
                })
            }

            if(punishmentsTemp!.length > 0) {
                punishmentsTemp?.forEach(function(punishment: PunishmentObject) {
                    let guild: Guild;
                    if((DateTime.fromJSDate(punishment.expiresAt).toMillis() - DateTime.fromJSDate(new Date()).toMillis()) <= 0) {
                        guild = <Guild>client.guilds.cache.get(punishment.guildID);
                        if(guild.members.cache.get(punishment.punishableID)) {
                            let user: GuildMember = <GuildMember>guild.members.cache.get(punishment.punishableID);
                            let role: Role = <Role>guild.roles.cache.find(x => x.name == "WFMUTED")
                            if(role) {
                                user.roles.remove(role)
                            }
                        }
        
                        sequelize.models.Punishments.update({active:0},{where:{id:punishment.id}})
                    } else {
                        guild = <Guild>client.guilds.cache.get(punishment.guildID);
                        if(guild.members.cache.get(punishment.punishableID)) {
                            let user: GuildMember = <GuildMember>guild.members.cache.get(punishment.punishableID);
                            let role: Role = <Role>guild.roles.cache.find(x => x.name == "WFMUTED")
                            if(role) {
                                if(!user.roles.cache.get(role.id)){
                                    user.roles.add(role)
                                }
                            }
                        }
                    }
                })
            }

            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' UnMuteWorker: Проверка на валидность наказаний окончена. Проверенно: ' + punishmentsTemp.length + ' временных наказаний и ' + punishmentsPerm.length + ' перманентных наказаний.');
        })
    }
}