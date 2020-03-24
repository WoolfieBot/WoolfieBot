import { Message } from "discord.js";

interface CommandData {
    name: string;
    aliases?: Array<string>;
    usage?: string;
    description: string;
    category: string;
}

class Command {

    readonly name: string;
    readonly aliases: Array<string>;
    readonly usage: string;
    readonly description: string;
    readonly category: string;

    constructor(data: CommandData) {
        this.name = data.name;

        this.aliases = data.aliases ? data.aliases : [];

        this.usage = data.usage ? data.usage : "Н/Д";

        this.description = data.description;
        
        this.category = data.category;
    }

    public run(message: Message, args: string[], cmd: string): void {
        throw new Error('Метод не предусмотрен.');
    }

}

export { Command };