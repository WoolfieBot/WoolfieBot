import { WoolfieClient } from "../../domain/WoolfieClient";

export = async (client: WoolfieClient): Promise<void> => {
    const url: string = await client.generateInvite(1610611702);

    console.log(`
    \nСервера           ==      ${client.guilds.cache.size}
    \nПользователи      ==      ${client.users.cache.size}
    \nВремя             ==      ${client.getTime()}
    \nПриглашение       ==      ${url}
    `);

    client.user?.setPresence({
        status: "idle",
        activity: {
            name: "woofing",
            type: "LISTENING"
        }
    })
}