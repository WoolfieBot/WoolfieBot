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
class Test extends Command_1.Command {
    constructor() {
        super({
            name: "test",
            description: "Test command",
            category: "fun"
        });
    }
    run(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            message.channel.send();
        });
    }
}
module.exports = Test;
