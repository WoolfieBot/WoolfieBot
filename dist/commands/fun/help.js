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
const discord_js_1 = require("discord.js");
class Help extends Command_1.Command {
    constructor() {
        super({
            name: "help",
            description: "Ya sral",
            usage: ">help",
            aliases: ["pizda", "chlen"],
            category: "fun"
        });
    }
    run(message, args) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let guildIcon = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.iconURL();
            let botAvatar = (_b = main_1.client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL();
            if (args[0]) {
                if (!main_1.client.commands.has(args[0]))
                    return message.channel.send("Такой команды не существует!");
                (_c = message.guild) === null || _c === void 0 ? void 0 : _c.iconURL;
                if (main_1.client.commands.has(args[0])) {
                    let command = main_1.client.commands.get(args[0]);
                    var SHembed = new discord_js_1.MessageEmbed()
                        .setColor(0x333333)
                        .setAuthor(`Список команд бота`, guildIcon)
                        .setTimestamp()
                        .setDescription(`**Префикс бота:** ${main_1.PREFIX}\n**Команда:** ${command.name}\n**Описание:** ${command.description || "Нет описания."}\n**Использование:** ${command.usage}\n**Псевдонимы:** ${command.aliases.join(", ") || "Н/Д"}`)
                        .setFooter("Тот самый бот", botAvatar);
                    message.channel.send(SHembed);
                }
            }
            if (!args[0]) {
                message.delete();
                let authorAvatar = message.author.avatarURL();
                let embed = new discord_js_1.MessageEmbed()
                    .setAuthor(`Ответ команды бота`, authorAvatar)
                    .setColor(0x333333)
                    .setDescription(`${message.author.username} проверь личные сообщения!`);
                let cmdName = "";
                main_1.client.commands.forEach(x => cmdName += x.name);
                let Sembed = new discord_js_1.MessageEmbed()
                    .setColor(0x333333)
                    .setAuthor(`Список команд бота`, guildIcon)
                    .setThumbnail(botAvatar)
                    .setTimestamp()
                    .setDescription(`Вот полный список команд которые доступны на данный момент! Что бы узнать подробное описание какой-то команды вернись на сервер и напиши >help <команда>\nПрефикс ботa: ${main_1.PREFIX}`)
                    .addField(`Команды:`, `\`${cmdName}\``)
                    .setFooter("Тот самый бот", botAvatar);
                message.channel.send(embed).then(m => m.delete({ timeout: 30000 }));
                message.author.send(Sembed);
            }
        });
    }
}
module.exports = Help;
