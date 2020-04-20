import { SimpleWorker } from "./WorkerTemplate";
import { WoolfieClient } from "../domain/WoolfieClient";
import { PunishmentObject } from "../domain/ObjectModels";
import { DateTime } from "luxon";
import { Guild, GuildMember } from "discord.js";
import sequelize from "../models/sequelize";
import { schedule } from "node-cron";

export class UnBanWorker extends SimpleWorker {
    constructor(){
        super({
            name: "UnBanWorker",
            timeMinute: 5
        })
    }
    
    async setWorker(client: WoolfieClient) {
        schedule('*/10 * * * *', async () => {
            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' UnBanWorker: Начата проверка на валидность наказаний...');

            const punishments: Array<PunishmentObject> | undefined = await client.provider.getActivePunishments("TEMPBAN");
            
            if(punishments!.length > 0) {
                punishments?.forEach(function(punishment: PunishmentObject) {
                    if((DateTime.fromJSDate(punishment.expiresAt).toMillis() - DateTime.fromJSDate(new Date()).toMillis()) <= 0) {
                        var guild: Guild = <Guild>client.guilds.cache.get(punishment.guildID);

                        if(guild.fetchBan(punishment.punishableID)) {
                            guild.members.unban(punishment.punishableID)
                        }
        
                        sequelize.models.Punishments.update({active:0},{where:{id:punishment.id}})
                    }
                })
            }

            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' UnBanWorker: Проверка на валидность наказаний окончена. Проверенно: ' + punishments.length + ' наказаний.');
        })
    }
}