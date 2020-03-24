"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class WoolfieProvider {
    constructor() {
        this.sequelize = new sequelize_1.Sequelize('bot', 'root', '', {
            host: 'localhost',
            dialect: 'mysql',
            logging: false
        });
    }
    Init() {
    }
}
exports.WoolfieProvider = WoolfieProvider;
