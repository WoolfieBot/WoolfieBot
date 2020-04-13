import { WoolfieClient } from "./WoolfieClient"
import { readdirSync } from "fs"

const loadE = (client: WoolfieClient) : void => {
    const eventFolders: Array<string> = ["guild","client"]

    eventFolders.forEach((folder:string) => {
        const events = readdirSync(`./events/${folder}/`).filter(d => d.endsWith('.js'))
        for (let file of events) {
            const evt = require(`../events/${folder}/${file}`)
            let eName: any = file.split(".")[0]
            client.on(eName, evt.bind(null, client))
        }
    })
}
export { loadE };