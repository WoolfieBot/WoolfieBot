"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const main_1 = require("../../main");
module.exports = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    if (message.guild == null)
        return;
    if (!message.content.startsWith(main_1.PREFIX))
        return;
    const args = message.content.slice(main_1.PREFIX.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command;
    if (cmd.length === 0)
        return;
    if (client.commands.has(cmd)) {
        command = client.commands.get(cmd);
    }
    if (client.aliases.has(cmd)) {
        command = client.aliases.get(cmd);
    }
    if (command) {
        command.run(message, args, cmd);
    }
});
