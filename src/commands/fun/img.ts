import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { client } from "../../main";
import osmosis from "osmosis";

class Img extends Command {
    constructor() {
        super({
            name: "img",
            usage: ">img <запрос>",
            description: "Команда с помощью которой вы можете найти картинки в Google.",
            category: "fun"
        });
    }
    async run(message: Message, args: string[]) {
        return message.channel.send('Команда в разработке')
        const imagefinder = require("imagefinder");
        imagefinder({
            keyword: 'dark knight'
        }).then((images: any) => {
            console.log(images)
        })
        const reverseImageSearch = require('reverse-image-search-google')

        const doSomething2 = (results: any) => {
            console.log(results)
        }

        reverseImageSearch('i.ebayimg.com/00/s/OTAwWDkwMA==/z/3G8AAOSwzoxd80XB/$_83.JPG', doSomething2)

        const imageSearch = (imageReq: string, callBack: any) => {
            osmosis
                .get('https://www.google.com.ua/search?source=lnms&tbm=isch&sa=X&q=' + encodeURI(imageReq))
                .find('div:nth-child(4) > div div > div > div > div.r > a')
                .set({
                    url: '@href',
                    title: 'h3'
                })
                .data(function (listing: any) {
                    callBack(listing)
                })
        }

        const doSomething = (results: any) => {
            console.log(results)
        }

        imageSearch("Привет", doSomething)
    }
}

export = Img;