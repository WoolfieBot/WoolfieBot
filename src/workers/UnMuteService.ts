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

            const punishments: Array<PunishmentObject> | undefined = await client.provider.getActivePunishments();

            if(punishments!.length > 0) {
                punishments?.forEach(function(punishment: PunishmentObject) {
                    if((DateTime.fromJSDate(punishment.expiresAt).toMillis() - DateTime.fromJSDate(new Date()).toMillis()) <= 0) {
                        var guild: Guild = <Guild>client.guilds.cache.get(punishment.guildID);
                        
                        if(guild.members.cache.get(punishment.punishableID)) {
                            let user: GuildMember = <GuildMember>guild.members.cache.get(punishment.punishableID);
                            let role: Role = <Role>guild.roles.cache.find(x => x.name == "Замьючен")
                            user.roles.remove(role)
                        }
    
                        sequelize.models.Punishments.update({active:0},{where:{punishableID:punishment.punishableID}})
                    }
                })
            }

            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' UnMuteWorker: Проверка на валидность наказаний окончена. Проверенно: ' + punishments.length + ' наказаний.');
        })
    }
}