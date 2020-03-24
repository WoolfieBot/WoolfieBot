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
module.exports = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const url = yield client.generateInvite("ADMINISTRATOR");
    console.log(`
    \nСервера           ==      ${client.guilds.cache.size}
    \nПользователи      ==      ${client.users.cache.size}
    \nВремя             ==      ${client.getTime()}
    \nПриглашение       ==      ${url}
    `);
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        status: "idle",
        activity: {
            name: "Пишу хуйню",
            type: "LISTENING"
        }
    });
});
