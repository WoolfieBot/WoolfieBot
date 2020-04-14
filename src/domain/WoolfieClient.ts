import { Client } from "discord.js";
import moment from 'moment';
import { Command } from "./Command";
import { load } from './CommandHandler';
import { loadE } from "./EventHandler";
import { WoolfieProvider } from "./WoolfieProvider";

class WoolfieClient extends Client {
    
    public commands: Map<string, Command> =  new Map();
    public aliases: Map<string, Command> = new Map();
    public category: Array<string> = ["fun","info","moderation","other","stuff","works"];
    public provider: WoolfieProvider;

    constructor(token: any){
        super();
        super.login(token);
        this.getCommands();
        this.getEvents();
        this.commands;
        this.aliases;
        this.category;
        this.provider = new WoolfieProvider();
    }

    public getTime() {
        return moment(Date.now())
            .toString()
            .split(" ")
            .splice(0, 5)
            .join(" ")
            .toLocaleUpperCase();
    }

    private getCommands(): void {
        return load(this);
    }

    private getEvents(): void {
        return loadE(this)
    }

}

export { WoolfieClient };