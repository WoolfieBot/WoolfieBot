"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WoolfieClient_1 = require("./domain/WoolfieClient");
const dotenv_1 = require("dotenv");
dotenv_1.config({ path: "../.env" });
const client = new WoolfieClient_1.WoolfieClient(process.env.TOKEN);
exports.client = client;
const PREFIX = ">";
exports.PREFIX = PREFIX;
