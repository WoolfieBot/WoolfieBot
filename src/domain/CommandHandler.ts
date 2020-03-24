import { WoolfieClient } from './WoolfieClient';
import { readdirSync } from 'fs';
import { Command } from './Command';

const load = (client: WoolfieClient):void => {

    const commandFolders: Array<string> = client.category

    commandFolders.forEach((folder: string) => {

        const commandFiles: Array<string> = readdirSync(`./commands/${folder}/`).filter((c: string) => c.endsWith(".js"))

        for(let file of commandFiles){
            const pull = require(`../commands/${folder}/${file}`)
            const cmd: Command = new pull(client)
            client.category.forEach(x => {
                if(cmd.category !== x){
                    throw new Error('Такой котегории не существует.')
                }
            });
            client.commands.set(cmd.name, cmd);
            if(cmd.aliases){
                cmd.aliases.forEach((alias: string) => {
                    client.aliases.set(alias, cmd)
                });
            }
        }
    });
}
export { load };