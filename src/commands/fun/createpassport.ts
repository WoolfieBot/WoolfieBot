import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";
import { client } from "../../main";
const isImageUrl = require("is-image-url");
const isDone = new Map();

class CreatePass extends Command {
    constructor(){
        super({
            name: "createpass",
            description: "Данная команда создает Ваш паспорт, он нужен для того что бы начать игру в мини-РПГ и иметь доступ к банку, заработку денег, работам и многим многм другим функциям! Обязательно прочтите условия пользования перед созданием паспорта!",
            aliases: ["cp"],
            category: "fun",
            usage: ">createpass"
        });
    } 

    async run(message: Message, args: Array<string>) {
        if(await client.provider.getPassportInfo(message.guild!.id,message.author.id)) return message.channel.send(`У вас уже есть паспорт! Вы не можете создать еще один!`)
        if(isDone.get(message.guild?.id) !== undefined) return message.channel.send("Кто то уже выполняет регистрацию! Дождитесь пока её окончат.")
        isDone.set(message.guild?.id, message.author.id);
        const info = new Map();
        message.channel.send("Перед тем как продолжить **обязательно** прочтите это!\nПродолжая вы соглашаетесь, на то что Вас будут пинговать (упоминать) время от времени, хранение и обработка вашей личной информации (сообщения в текстовом чате, информация об аккаунте, игровая активность и прочее). Так же подготовьте заранее Вашу краткую биографию для паспорта, если вы не готовы или если вы против напишите **Нет** если согласны напишите **Да**.");
        var filter = (m: Message) => m.content == "Да" || m.content == "Нет" && m.author.id == isDone.get(m.guild?.id) && m.content.length > 0;
        var collector = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] });
        if(collector.first()?.toString() == "Нет" || !collector.first()) return message.channel.send("Вы отказались от условий.").then(m => isDone.delete(m.guild?.id));
        collector.first()?.delete();
        client.user?.lastMessage?.delete()
        if(isDone.get(message.guild?.id) == undefined) return;

        message.channel.send("Теперь укажите своё имя. **(Его нельзя будет изменить!)**")
        var filter1 = (m: Message) => m.author.id == isDone.get(m.guild?.id) && m.content.length > 0;
        var collector1 = await message.channel.awaitMessages(filter1, { max: 1, time: 60000, errors: ['time'] });
        info.set("name", collector1.first()?.toString());
        collector1.first()?.delete();
        client.user?.lastMessage?.delete()
        if(isDone.get(message.guild?.id) == undefined) return;

        message.channel.send("Ваше имя - **" + info.get("name") + "**\nВы хотите оставить его? (Да/Нет)");
        var filter2 = (m: Message) => m.content == "Да" || m.content == "Нет" && m.author.id == isDone.get(m.guild?.id) && m.content.length > 0;
        var collector2 = await message.channel.awaitMessages(filter2, { max: 1, time: 60000, errors: ['time'] });
        if(collector2.first()?.toString() == "Нет" || !collector2.first()) return message.channel.send("Вы отказались от имени. Пройдите регистрацию заново.").then(m => isDone.delete(m.guild?.id));
        collector2.first()?.delete();
        client.user?.lastMessage?.delete()
        if(isDone.get(message.guild?.id) == undefined) return;

        message.channel.send("Теперь укажите свою фамилию. **(Её нельзя будет изменить!)**");
        var filter3 = (m: Message) => m.author.id == isDone.get(m.guild?.id) && m.content.length > 0;
        var collector3 = await message.channel.awaitMessages(filter3, { max: 1, time: 60000, errors: ['time'] });        
        info.set("surname", collector3.first()?.toString());
        collector3.first()?.delete();
        client.user?.lastMessage?.delete()
        if(isDone.get(message.guild?.id) == undefined) return;
        
        message.channel.send("Ваша фамилия - **" + info.get("surname") + "**\nВы хотите оставить ёё? (Да/Нет)\nДалее проверок не будет.");
        var filter4 = (m: Message) => m.content == "Да" || m.content == "Нет" && m.author.id == isDone.get(m.guild?.id) && m.content.length > 0;
        var collector4 = await message.channel.awaitMessages(filter4, { max: 1, time: 60000, errors: ['time'] });
        if(collector4.first()?.toString() == "Нет" || !collector4.first()) return message.channel.send("Вы отказались от фамилии. Пройдите регистрацию заново.").then(m => isDone.delete(m.guild?.id));
        collector4.first()?.delete();
        client.user?.lastMessage?.delete()
        if(isDone.get(message.guild?.id) == undefined) return;

        message.channel.send("Теперь выберете Ваш пол (М/Ж)");
        var filter5 = (m: Message) => m.content == "М" || m.content == "Ж" && m.author.id == isDone.get(m.guild?.id) && m.content.length > 0;
        var collector5 = await message.channel.awaitMessages(filter5, { max: 1, time: 60000, errors: ['time'] });
        if(collector5.first()?.toString() == "М"){ info.set("sex", 0) } else { info.set("sex", 1) };
        collector5.first()?.delete();
        client.user?.lastMessage?.delete()
        if(isDone.get(message.guild?.id) == undefined) return;

        message.channel.send("Теперь укажите сколько вам лет (Любое число от 18 до 60)");
        var filter6 = (m: Message) => m.author.id == isDone.get(m.guild?.id) && parseInt(m.content) <= 60 && parseInt(m.content) > 17;
        var collector6 = await message.channel.awaitMessages(filter6, { max: 1, time: 60000, errors: ['time'] });
        info.set("age", parseInt(collector6.first()!.toString()))
        collector6.first()?.delete();
        client.user?.lastMessage?.delete()
        if(isDone.get(message.guild?.id) == undefined) return;

        message.channel.send("Теперь расскажите немного о себе! (Любой текст от 150 символов до 1024.)");
        var filter7 = (m: Message) => m.author.id == isDone.get(m.guild?.id) && m.content.length > 150 && m.content.length > 0 && m.content.length < 1024;
        var collector7 = await message.channel.awaitMessages(filter7, { max: 1, time: 60000, errors: ['time'] });
        info.set("bio", collector7.first()!.toString())
        collector7.first()?.delete();
        client.user?.lastMessage?.delete()
        if(isDone.get(message.guild?.id) == undefined) return;

        message.channel.send("Теперь укажите Ваш день рождения. Пример: 20/08 (Год не нужен, он сам считается в зависимости от возраста который Вы указали).");
        var filter8 = (m: Message) => m.author.id == isDone.get(m.guild?.id) && m.content.length <= 5 && m.content.length > 0 && m.content.includes("/");
        await message.channel.awaitMessages(filter8, { max: 1, time: 60000, errors: ['time'] }).then(c => {
            let replacedDateString = (c.first()?.toString())!.replace("/", "");
            if(isNaN(parseInt(replacedDateString)) || parseInt(replacedDateString) > 3212) return message.channel.send("Вы некорректно указали дату.").then(m => isDone.delete(m.guild?.id));
            info.set("birthday", replacedDateString);
            c.first()?.delete();
        }).catch(c => isDone.delete(message.guild?.id));
        if(isDone.get(message.guild?.id) == undefined) return;  
        client.user?.lastMessage?.delete()

        message.channel.send("Теперь укажите ссылку на Вашу фотографию паспорта. (Убедитесь что ссылка ведет именно на фотографию а не на сайт с фотографией, и в конце ссылки есть .png, .jpg, .jpeg и т.д.).");
        var filter9 = (m: Message) => m.author.id == isDone.get(m.guild?.id) && isImageUrl(m.content);
        await message.channel.awaitMessages(filter9, { max: 1, time: 60000, errors: ['time'] }).then(c => {
            info.set("photo", c.first()?.toString());
            c.first()?.delete();
        }).catch(c => isDone.delete(message.guild?.id));
        if(isDone.get(message.guild?.id) == undefined) return;
        client.user?.lastMessage?.delete()

        var dateString = (new Date().getFullYear() - info.get("age")).toString() + "-" + info.get("birthday").substring(2,4) + "-" + info.get("birthday").substring(0,2);
        var replacedSex;
        if(info.get("sex") == 0){ replacedSex = "Мужской" } else { replacedSex = "Женский" };

        message.channel.send(
            new MessageEmbed()
                .setTitle(`Паспорт пользователя ` + message.author.username)
                .setThumbnail(info.get("photo"))
                .setFooter("ХУЙЛО ЕБАНОЕ БЛЯТЬ Я СРАЛ ВОНЯЛ НЕ СРЁМ!)))")
                .addField("Основная информация:", stripIndents`**> Имя:** ${info.get("name")}
                **> Фамилия:** ${info.get("surname")}
                **> Пол:** ${replacedSex}
                **> Возраст:** ${info.get("age")}
                **> День рождения:** ${dateString}
                **> Биография:** ${info.get("bio")}`, true)
                .addField("Дополнительная информация:", stripIndents`**> Законопослушность: **100
                **> Водительские права: **Нету
                **> Работа: **Безработный
                **> Уровень работы: **Безработный
                **> Лицензия на оружие: **Нету
                **> Семейный статус: **Не женат/Не замужем`, true)
                .setTimestamp()
        )
        
        message.channel.send(`Ваш паспорт будет выглядеть так. Вы хотите оставить его таким? (Это последний шанс что то изменить! Да/Нет) `)
        var filter10 = (m: Message) => m.content == "Да" || m.content == "Нет" && m.author.id == isDone.get(m.guild?.id) && m.content.length > 0;
        await message.channel.awaitMessages(filter10, { max: 1, time: 60000, errors: ['time'] }).then(c => {
            if(c.first()?.toString() == "Нет" || !c.first()) return message.channel.send("Вы отказались от создания.").then(m => isDone.delete(m.guild?.id));
            c.first()?.delete()
        }).catch(c => isDone.delete(message.guild?.id));
        client.user?.lastMessage?.delete();
        if(isDone.get(message.guild?.id) == undefined) return;     
        
        if(await client.provider.createPassport(message.guild!.id,isDone.get(message.guild?.id),info.get("name"),info.get("surname"),new Date(dateString).toISOString(),parseInt(info.get("sex")),info.get("age"),info.get("bio"),info.get("photo")) == true){
            message.channel.send(`Паспорт успешно создан!`)
        }else{
            message.channel.send(`Произошла ошибка при создании паспорта. Повторите попытку позже.`)
        }
        isDone.delete(message.guild?.id);
    }
}

export = CreatePass;