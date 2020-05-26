import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";

class Ping extends Command {
    constructor() {
        super({
            name: "ping",
            usage: ">ping",
            description: "Команда позволяющая узнать задержку между ответами бота, и задержку API дискорда.",
            category: "info"
        });
    }
    async run(message: Message, args: string[]) {
        const m = await message.channel.send("Пинг?");
        await m.edit(`Понг! Задержка ответа бота составляет **${m.createdTimestamp - message.createdTimestamp}ms.** Задержка API дискорда составляет **${Math.round(client.ws.ping)}ms**`);
    }
}

export = Ping;