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
            usage: ">addnote [{название записки}] [содержимое записки]",
            description: "Команда создающая записку.",
            category: "fun",
            aliases: ["an", "addn"]
        });
    }
    run(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args[0])
                return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``);
            if (!args[1])
                return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``);
            if ((yield main_1.client.provider.getNote(message.guild.id, args[0])) !== null)
                return message.channel.send(`Такая записка уже существует!`);
            let noteName = Array.from(args.slice(0).join(" ").matchAll(/{(.*?)}/));
            if (noteName.length !== 0) {
                let note = args.slice(0).join(" ").replace(noteName[0][0], "");
                if ((yield main_1.client.provider.createNote(message.guild.id, noteName[0][1], note, message.author.id)) == true) {
                    return message.channel.send(`Записка ${noteName[0][1]} успешно создана!`);
                }
                else {
                    return message.channel.send(`Произошла ошибка при создании записки.`);
                }
            }
            else {
                if ((yield main_1.client.provider.createNote(message.guild.id, args[0], args.slice(1).join(' '), message.author.id)) == true) {
                    return message.channel.send(`Записка ${args[0]} успешно создана!`);
                }
                else {
                    return message.channel.send(`Произошла ошибка при создании записки.`);
                }
            }
        });
    }
}
module.exports = AddNote;
