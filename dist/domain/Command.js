"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(data) {
        this.name = data.name;
        this.aliases = data.aliases ? data.aliases : [];
        this.usage = data.usage ? data.usage : "Н/Д";
        this.description = data.description;
        this.category = data.category;
    }
    run(message, args, cmd) {
        throw new Error('Метод не предусмотрен.');
    }
}
exports.Command = Command;
