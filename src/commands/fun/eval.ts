import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import * as util from "util";
import { client } from "../../main";
import { WoolfieClient } from "../../domain/WoolfieClient";
class Eval extends Command {
    constructor(){
        super({
            name: "eval",
            usage: ">eval [Код]",
            description: "Команда для тестирования кода, доступна только разработчику.",
            category: "fun",
            aliases: ["e","ev"]
        });
    }
    
    async run(message: Message, args: Array<string>, cmd: string, ops: any, client: WoolfieClient) {
        const ownerid = "648620324283482120";
        if(message.author.id === ownerid) {
            try {
                let toEval = args.join(" ");
                let evaluated = util.inspect(eval("(async () => {" + toEval + "})()"));
                if(toEval) {
                    let hrStart = process.hrtime()
                    let hrDiff;
                    hrDiff = process.hrtime(hrStart);
                    return message.channel.send(`Запущено за ${hrDiff[0] > 0 ? `${hrDiff[0]}s `: ''}*${hrDiff[1] / 1000000}ms.*\`\`\`js\n${evaluated}\n\`\`\``);
                } else {
                    message.channel.send("Укажите код который нужно протестировать. `Невозможно протестировать воздух`");
                }
            } catch(error) {
                message.channel.send(`Ошибка при тестировании кода: \`${error}\``)
            }
        } else {
            return message.channel.send("У вас недостаточно прав на использование данной команды.")
        }

    } 
}

export = Eval;