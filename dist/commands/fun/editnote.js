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
class Editnote extends Command_1.Command {
    constructor() {
        super({
            name: "editnote",
            usage: ">editnote {Название записки} {Изменённое содержимое}",
            description: "Команда которая изменяет ваши записки.",
            category: "fun",
            aliases: ["edn", "enote"]
        });
    }
    run(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args[0])
                return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``);
            if (!args[1])
                return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``);
            let noteName = Array.from(args.slice(0).join(" ").matchAll(/{(.*?)}/));
            if ((yield main_1.client.provider.getUserNote(message.guild.id, message.author.id, noteName[0][1])) !== null) {
                let note = args.slice(0).join(" ").replace(noteName[0][0], "");
                if ((yield main_1.client.provider.editNote(message.guild.id, noteName[0][1], note)) == true) {
                    message.channel.send(`Записка успешно изменена!`);
                }
                else {
                    message.channel.send(`При редактировании записки произошла ошибка!`);
                }
            }
            else {
                message.channel.send('У тебя нет такой зписки!');
            }
        });
    }
}
module.exports = Editnote;
