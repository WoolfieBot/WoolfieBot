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
                return console.exception(`Произошла ошибка при получении данных о сервере ID: ` + guildID);
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
}
exports.WoolfieProvider = WoolfieProvider;
