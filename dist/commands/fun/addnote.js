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
class AddNote extends Command_1.Command {
    constructor() {
        super({
            name: "addnote",
            usage: ">addnote {название записки} {содержимое записки}",
            description: "Команда создающая записку.",
            category: "fun",
            aliases: ["an", "addn"]
        });
    }
    run(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args[0])
                return message.channel.send('Вы не указали название записки!');
            if (!args[1])
                return message.channel.send('Вы не указали содержимое записки!');
            if ((yield main_1.client.provider.getNote(message.guild.id, args[0])) !== null)
                return message.channel.send(`Такая записка уже существует!`);
            let note = args.slice(1).join(' ');
            let noteName = args.slice(0).join(" ").matchAll(/{(.*?)}/).toString();
            if ((yield main_1.client.provider.createNote(message.guild.id, args[0], note, message.author.id)) == true) {
                return message.channel.send(`Записка ${args[0]} успешно создана!`);
            }
            else {
                return message.channel.send(`Произошла ошибка при создании записки.`);
            }
        });
    }
}
module.exports = AddNote;
