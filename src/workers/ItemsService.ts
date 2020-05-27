import { SimpleWorker } from "./WorkerTemplate";
import { WoolfieClient } from "../domain/WoolfieClient";
import { schedule } from "node-cron";
import sequelize from "../models/sequelize";
import {UserProfileData} from "../domain/ObjectModels";
import {DateTime} from "luxon";

export class ItemsService extends SimpleWorker {
    constructor(){
        super({
            name: "ItemsService",
            timeMinute: 5
        })
    }

    async setWorker(client: WoolfieClient) {
        schedule('*/1 * * * *', async () => {
            let startTime = DateTime.local().toMillis();
            let profiles: Array<UserProfileData> = await sequelize.models.profiles.findAll()

            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' ItemsService: Начата проверка предметов...');

            profiles.forEach((profile) => {
                let obj: any = JSON.parse(`{${profile.items}}`)
                Object.keys(obj).forEach(async (x: any) => {
                    if(obj[x].lastUse === null) return
                    if(obj[x].lastUse <= DateTime.fromJSDate(new Date()).toMillis()) {
                        obj[x].lastUse = null;
                        await client.provider.updateProfile(profile.guildID,profile.userID,{items:JSON.stringify(obj).substr(1, JSON.stringify(obj).length - 2)})
                    }
                })
            })

            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' ItemsService: Проверка завершена! Проверенно: ' + profiles.length + ' профилей. За: ' + Math.floor(DateTime.local().toMillis() -startTime) + ' ms.');
        })
    }
}