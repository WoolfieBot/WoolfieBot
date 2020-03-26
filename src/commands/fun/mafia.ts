import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";

class Mafia extends Command {
    constructor(){
        super({
            name: "mafia",
            usage: ">mafia start",
            description: "АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ АУЕ ТАТАРЫ ",
            category: "fun",
            aliases: ["maf","m"]
        });
    }
    
    async run(message: Message, args: Array<string>, cmd: string, ops: any) {
        let embed = new MessageEmbed()
            .setAuthor(`Мафия ебать`)
            .setDescription(`Нажми на реакцию или дам пизды`)
        message.channel.send(embed).then(m => {m.react('👺')
        const fiter1 = (reaction:any, user:any) : any => reaction.emoji.name === '👺' && user.id !== "658593409401094147";
            const collector = m.createReactionCollector(fiter1, {time: 30000})
            collector.on("end", c => c.forEach(x => console.log(x)))
            const filter = (m: any): any => m.content.startsWith('start')

            m.channel.awaitMessages(filter,{max: 1, time: 30000, errors:['time']})
                .then(c => collector.stop())
    })
    }
}

export = Mafia;