import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";

class AddNote extends Command {
    constructor(){
        super({
            name: "addnote",
            usage: ">addnote {название записки} {содержимое записки}",
            description: "Команда создающая записку.",
            category: "fun",
            aliases: ["an","addn"]
        });
    }
    
    async run(message: Message, args: Array<string>) {
        if(!args[0]) return message.channel.send('Вы не указали название записки!')
        if(!args[1]) return message.channel.send('Вы не указали содержимое записки!')

        if(await client.provider.getNote(message.guild!.id, args[0]) !== null) return message.channel.send(`Такая записка уже существует!`)
        let note: string = args.slice(1).join(' ')
        let noteName: string = args.slice(0).join(" ").matchAll(/{(.*?)}/).toString()
        
        if(await client.provider.createNote(message.guild!.id, args[0], note, message.author.id) == true){
            return message.channel.send(`Записка ${args[0]} успешно создана!`)
        }else{
           return message.channel.send(`Произошла ошибка при создании записки.`)
        }
    }
}

export = AddNote;