import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";

class Test extends Command {
    constructor(){
        super({
            name: "test",
            description: "Test command",
            category: "fun"
        });
    }

    async run(message: Message, args: Array<string>) {
        message.channel.send()
    }
}

export = Test;