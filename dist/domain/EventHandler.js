"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const loadE = (client) => {
    const eventFolders = ["guild", "client"];
    eventFolders.forEach((folder) => {
        const events = fs_1.readdirSync(`./events/${folder}/`).filter(d => d.endsWith('.js'));
        for (let file of events) {
            const evt = require(`../events/${folder}/${file}`);
            let eName = file.split(".")[0];
            client.on(eName, evt.bind(null, client));
        }
    });
};
exports.loadE = loadE;
