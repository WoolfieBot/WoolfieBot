import { Message } from "discord.js";
import { WoolfieClient } from "../../domain/WoolfieClient";
import { PREFIX } from "../../main";

export = async (client: WoolfieClient, message: Message): Promise<void> => {
    if(message.author.bot) return;
    if(message.guild == null) return;
    
    if(!message.content.startsWith(PREFIX)) return;

    const args: Array<string> = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const cmd: string = args.shift()!.toLowerCase();

    let command;

    if(cmd.length === 0) return;

    if(client.commands.has(cmd)){
        command = client.commands.get(cmd);
    }

    if(client.aliases.has(cmd)){
        command = client.aliases.get(cmd)
    }

    if(command) {
        command.run(message, args, cmd);
    }
}