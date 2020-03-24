"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment = require("moment");
const CommandHandler_1 = require("./CommandHandler");
const EventHandler_1 = require("./EventHandler");
const WoolfieProvider_1 = require("./WoolfieProvider");
class WoolfieClient extends discord_js_1.Client {
    constructor(token) {
        super();
        this.commands = new Map();
        this.aliases = new Map();
        this.category = ["fun"];
        super.login(token);
        this.getCommands();
        this.getEvents();
        this.commands;
        this.aliases;
        this.category;
        this.provider = new WoolfieProvider_1.WoolfieProvider();
    }
    getTime() {
        return moment(Date.now())
            .toString()
            .split(" ")
            .splice(0, 5)
            .join(" ")
            .toLocaleUpperCase();
    }
    getCommands() {
        return CommandHandler_1.load(this);
    }
    getEvents() {
        return EventHandler_1.loadE(this);
    }
}
exports.WoolfieClient = WoolfieClient;
