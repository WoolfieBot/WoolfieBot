import { SimpleWorker } from "./WorkerTemplate";
import { WoolfieClient } from "../domain/WoolfieClient";
import { schedule } from "node-cron";
import sequelize from "../models/sequelize";
import {UserInventory} from "../domain/ObjectModels";
import {DateTime} from "luxon";
import { writeFileSync } from "fs";
import items from "../assets/items.json";

export const cachedIndexes: Array<string> = [];

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
            let inventoryes: Array<UserInventory> = await sequelize.models.inventoryes.findAll()

            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' ItemsService: Начата проверка предметов...');

            for (const inv of inventoryes) {
                if(inv.lastUse === null) continue;
                    if(DateTime.fromJSDate(inv.lastUse).toMillis() <= DateTime.fromJSDate(new Date()).toMillis()) {
                        await sequelize.models.inventoryes.update({lastUse: null}, {where:{guildID: inv.guildID, userID: inv.userID, itemID: inv.itemID}})
                    }
            }

            let namesArr: Array<string> = [];
            let timeExpired: boolean = false;

            for (let itemKey in items) {
                if(items.hasOwnProperty(itemKey)) {
                    if(items[itemKey].isItemOfDay) {
                        if((items[itemKey].updatedAt - DateTime.fromJSDate(new Date()).toMillis()) <= 0) {
                            timeExpired = true;

                            items[itemKey].sale = null;
                            items[itemKey].isItemOfDay = false;
                            items[itemKey].updatedAt = null;
                        } else {
                            continue;
                        }
                    }
                    namesArr.push(itemKey)
                }
            }

            for (let itemsKey in items) {
                if (items.hasOwnProperty(itemsKey)) {

                    if (items[itemsKey].isItemOfDay) {

                        cachedIndexes.unshift(itemsKey)
                        continue;
                    }

                    cachedIndexes.push(itemsKey)
                }
            }

            if(timeExpired) {
                let random = namesArr[Math.floor(Math.random() * namesArr.length)];

                items[random].sale = await client.provider.getRandomInt(5, 50);
                items[random].updatedAt = DateTime.fromJSDate(new Date()).plus({hours: 24}).toMillis();
                items[random].isItemOfDay = true;

                await writeFileSync('/home/Node1/WoolfieBot/dist/assets/items.json', JSON.stringify(items, null, 2))
            }

            console.log('[' + DateTime.local().toFormat("TT") + ']' + ' ItemsService: Проверка завершена! Проверенно: ' + inventoryes.length + ' предметов. За: ' + Math.floor(DateTime.local().toMillis() -startTime) + ' ms.');
        })
    }
}