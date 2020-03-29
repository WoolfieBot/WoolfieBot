import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";

class Bank extends Command {
    constructor(){
        super({
            name: "bank",
            description: "Команда для взаимодействия с вашим банком. Переводите деньги в банк, для того что бы у вас их не смогли украсть!",
            category: "fun",
            usage: ">bank withdraw [Количество денег которое хотите вывести], >bank deposit [Количество денег которое хотите перевести на свой счёт]"
        });
    }

    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        if(!args[1]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        if(isNaN(parseInt(args[1]))) return message.channel.send(`Аргумент который вы указали не является числом!`)
        const profile = await client.provider.getProfile(message.guild!.id,message.author.id)
        var bankMax = 10000 + (5000 * parseInt(profile.bankLvl));        
        if(args[0] == "deposit"){
            if(parseInt(profile.bank) + parseInt(args[1]) > bankMax || parseInt(args[1]) < 1  || parseInt(profile.coins) < parseInt(args[1])) return message.channel.send(`Сумму которую вы пытаетесь перевести больше вашего лимита, меньше суммы наличных или меньше \`1\` монеты! Ваш лимит: \`${bankMax}\`. Ваш баланс: \`${profile.bank}\`.`)
            let k = parseInt(profile.coins) - parseInt(args[1])
            await client.provider.updateRanks(message.guild!.id,message.author.id,{bank:Math.round(parseInt(args[1]))})
            await client.provider.updateProfile(message.guild!.id,message.author.id,{coins:Math.round(k)})
            message.channel.send(`Вы успешно совершили перевод на счёт банка в размере **${Math.round(parseInt(args[1]))}** монет!`)
        }
        if(args[0] == "withdraw"){
            if(parseInt(args[1]) < 1  || parseInt(profile.bank) < parseInt(args[1])) return message.channel.send(`Сумму которую вы пытаетесь снять больше вашего баланса или меньше \`1\` монеты! Ваш баланс: \`${profile.bank}\`.`)
            let k = parseInt(profile.bank) - parseInt(args[1])
            await client.provider.updateRanks(message.guild!.id,message.author.id,{coins:Math.round(parseInt(args[1]))})
            await client.provider.updateProfile(message.guild!.id,message.author.id,{bank:Math.round(k)})
            message.channel.send(`Вы успешно сняли деньги с банка в размере **${Math.round(parseInt(args[1]))}** монет!`)
        }
    }
}

export = Bank;