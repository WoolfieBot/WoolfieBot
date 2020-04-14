import { Command } from "../../domain/Command";
import { Message } from "discord.js";

class Test extends Command {
    constructor(){
        super({
            name: "test",
            description: "Test command",
            category: "stuff"
        });
    }

    async run(message: Message, args: Array<string>) {
        console.log()
    }
}

export = Test;