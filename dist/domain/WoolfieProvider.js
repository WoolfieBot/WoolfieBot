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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize = require("../models/sequelize");
class WoolfieProvider {
    init() {
        require('../models/index');
    }
    getGuild(guildID) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield sequelize.models.guilds.findOne({ where: { guildID: guildID } });
            if (data) {
                return data;
            }
            else {
                return console.log(`Произошла ошибка при получении данных о сервере ID: ` + guildID);
            }
        });
    }
    getNote(guildID, noteName) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield sequelize.models.notes.findOne({ where: { guildID: guildID, noteName: noteName } });
            if (data) {
                return data;
            }
            else {
                return null;
            }
        });
    }
    createNote(guildID, noteName, note, creatorID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                sequelize.models.notes.create({ guildID: guildID, noteName: noteName, note: note, creatorID: creatorID });
            }
            catch (error) {
                return false + error;
            }
            return true;
        });
    }
    getAllNotes(guildID) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield sequelize.models.notes.findAll({ where: { guildID: guildID } });
            if (data) {
                return data;
            }
            else {
                return null;
            }
        });
    }
    getAllUsersNote(guildID, creatorID) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield sequelize.models.notes.findAll({ where: { guildID: guildID, creatorID: creatorID } });
            if (data) {
                return data;
            }
            else {
                return null;
            }
        });
    }
    getUserNote(guildID, creatorID, noteName) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield sequelize.models.notes.findOne({ where: { guildID: guildID, creatorID: creatorID, noteName: noteName } });
            if (data) {
                return data;
            }
            else {
                return null;
            }
        });
    }
    editNote(guildID, noteName, note) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                sequelize.models.notes.update({ note: note }, { where: { guildID: guildID, noteName: noteName } });
            }
            catch (error) {
                return false + error;
            }
            return true;
        });
    }
    getMember(message, toFind = '') {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            toFind = toFind.toLowerCase();
            let target = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(toFind);
            if (!target && message.mentions.members)
                target = message.mentions.members.first();
            if (!target && toFind) {
                target = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.find(member => {
                    return member.displayName.toLowerCase().includes(toFind) ||
                        member.user.tag.toLowerCase().includes(toFind);
                });
            }
            if (!target)
                target = message.member;
            return target;
        });
    }
}
exports.WoolfieProvider = WoolfieProvider;
