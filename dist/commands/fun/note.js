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
const Command_1 = require("../../domain/Command");
const main_1 = require("../../main");
class Note extends Command_1.Command {
    constructor() {
        super({
            name: "note",
            usage: ">note {название записки}, >note all, >note all {упоминание пользователя}",
            description: "Команда которая выдает конкретную записку, все записки сервера и все записки пользователя.",
            category: "fun",
            aliases: ["n", "nt"]
        });
    }
    run(message, args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!args[0])
                return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help note\`\`\``);
            if (args[0] === "all" && !args[1]) {
                let string = "";
                let data = yield main_1.client.provider.getAllNotes(message.guild.id);
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const element = data[key];
                        string += `${element.noteName}, `;
                    }
                }
                return message.channel.send(`Все записки для сервера **${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.name}**: ${string}`);
            }
            if (args[0] === "all" && args[1]) {
                let string = "";
                let member = yield main_1.client.provider.getMember(message, args.slice(1).join(" "));
                let data = yield main_1.client.provider.getAllUsersNote(message.guild.id, member.user.id);
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const element = data[key];
                        string += `${element.noteName}, `;
                    }
                }
                if (string.length == 0) {
                    return message.channel.send(`У данного пользователя еще нет записок!`);
                }
                return message.channel.send(`Все записки пользователя **${member.nickname}**: ${string}`);
            }
            let data = yield main_1.client.provider.getNote(message.guild.id, args[0]);
            if (data) {
                message.channel.send(data.note);
            }
            else {
                message.channel.send(`Такой записки не существует`);
            }
        });
    }
}
module.exports = Note;
