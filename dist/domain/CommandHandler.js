"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const load = (client) => {
    const commandFolders = client.category;
    commandFolders.forEach((folder) => {
        const commandFiles = fs_1.readdirSync(`./commands/${folder}/`).filter((c) => c.endsWith(".js"));
        for (let file of commandFiles) {
            const pull = require(`../commands/${folder}/${file}`);
            const cmd = new pull(client);
            client.category.forEach(x => {
                if (cmd.category !== x) {
                    throw new Error('Такой котегории не существует.');
                }
            });
            client.commands.set(cmd.name, cmd);
            if (cmd.aliases) {
                cmd.aliases.forEach((alias) => {
                    client.aliases.set(alias, cmd);
                });
            }
        }
    });
};
exports.load = load;
