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
            collector.on("end", c => c.forEach(x => ops.set(m.guild?.id,{bigdaddy: null, mafia: null, doctor: null, commisar: null, civilian: null, users:x.users.cache.filter(x => x.bot === false).map(x => x.id)})))
            const filter = (m: any): any => m.content.startsWith('start')
            m.channel.awaitMessages(filter,{max: 1, time: 30000, errors:['time']})
                .then(c => collector.stop(`${c.size}`))
                .catch(c => void(c))
    })
    await sleep(15000)
    //if(ops.get(message.guild?.id).users.length < 5) return message.channel.send(`Слишком мало вас нахуй, блять. Вас ` + ops.get(message.guild?.id).users.length + ` нахуй, а если бы было больше 5 блять, могли бы поиграть нахуй.`)
    if(ops.get(message.guild?.id).users.length == 5){
        var avaliableRoles = {
            mafia: 1,
            commisar: 1,
            doctor: 1,
            civilian: 2
        }
    }    
}
}
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
export = Mafia;