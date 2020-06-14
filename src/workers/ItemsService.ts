import { SimpleWorker } from "./WorkerTemplate";
import { WoolfieClient } from "../domain/WoolfieClient";
import { schedule } from "node-cron";
import sequelize from "../models/sequelize";
import {GuildObject, UserProfileData} from "../domain/ObjectModels";
import {DateTime} from "luxon";
import {DataTypes} from "sequelize";

export class ItemsService extends SimpleWorker {
    constructor(){
        super({
            name: "ItemsService",
            timeMinute: 5
        })
    }

    async setWorker(client: WoolfieClient) {
        return
        schedule('*/1 * * * *', async () => {
            let startTime = DateTime.local().toMillis();
            let profiles: Array<UserProfileData> = await sequelize.models.profiles.findAll()
            let guilds: Array<GuildObject> = await sequelize.models.guilds.findAll()

            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' ItemsService: Начата проверка предметов...');

            profiles.forEach((profile) => {
                let obj: any = JSON.parse(profile.items)
                Object.keys(obj).forEach(async (x: any) => {
                    if(obj[x].lastUse === null) return
                    if(obj[x].lastUse <= DateTime.fromJSDate(new Date()).toMillis()) {
                        obj[x].lastUse = null;
                        await client.provider.updateProfile(profile.guildID,profile.userID,{items:obj})
                    }
                })
            })

            guilds.forEach((value) => {
                if (value.itemOfDay !== null) {
                    let obj = JSON.parse(<string>value.itemOfDay)
                    if(obj.itemOfDay.update <= DateTime.fromJSDate(new Date()).toMillis()) {
                        let namesArr = ["xp_boost","shield","lotery","reverse_card"];
                        let random = namesArr[Math.floor(Math.random() * namesArr.length)];
                        let time = DateTime.fromJSDate(new Date()).plus({hours: 24}).toMillis()
                        client.provider.updateGuild(value.guildID,{itemOfDay: `{"itemOfDay":{"name":"${random}","update":${time}}}`})
                    }
                } else {
                    let namesArr = ["xp_boost","shield","lotery","reverse_card"];
                    let random = namesArr[Math.floor(Math.random() * namesArr.length)];
                    let time = DateTime.fromJSDate(new Date()).plus({hours: 24}).toMillis()
                    client.provider.updateGuild(value.guildID,{itemOfDay: `{"itemOfDay":{"name":"${random}","update":${time}}}`})
                }
            })

            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' ItemsService: Проверка завершена! Проверенно: ' + profiles.length + ' профилей. За: ' + Math.floor(DateTime.local().toMillis() -startTime) + ' ms.');
        })
    }
}