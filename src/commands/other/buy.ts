import {Command} from "../../domain/Command";
import {Message} from "discord.js";
import {client} from "../../main";
import {GuildObject, UserInventory, UserProfileData} from "../../domain/ObjectModels";
import {cachedIndexes} from "../../workers/ItemsService"
import items from "../../assets/items.json";
import sequelize from "../../models/sequelize";

class Buy extends Command {
    constructor() {
        super({
            name: "buy",
            description: "Команда для покупки предметов из магазина (см. >help shop)",
            category: "other",
            usage: ">buy <ID Предмета>"
        });
    }

    async run(message: Message, args: Array<string>) {
        // Проверка включен ли ранкинг
        const guild: GuildObject = await client.provider.getGuild(message.guild!.id);
        if(guild.isLvl === 0) return message.channel.send(`На данном сервере отключён ранкинг.`);

        if(!args[0]) return message.channel.send(`Вы пропустили обязательный аргумент! Посмотреть использование данной команды можно через: \`\`\`>help ${this.name}\`\`\``)
        const profile = await client.provider.getProfile(message.guild!.id, message.author.id);
        let itemOfDay = cachedIndexes[0];

        let inventory: Array<UserInventory> = await sequelize.models.inventoryes.findAll({where:{userID: profile.userID}})
        let cost: number;

        if(itemOfDay == "bank_upgrade") {

            items[itemOfDay].upgradeCost = Math.floor(10000 + (5000 * profile.bankLvl) * 1.40);
            cost = items[itemOfDay].upgradeCost - Math.floor( items[itemOfDay].upgradeCost / 100 * items[itemOfDay].sale)

        } else {

            cost = items[itemOfDay].cost - Math.floor( items[itemOfDay].cost / 100 * items[itemOfDay].sale)

        }

        let newAmount: number = 0;
        let item;
        switch (args[0]) {
            case "1":
                if(profile.coins < cost) return message.channel.send("Недостаточно наличных для совершения покупки!")
                item = inventory.find(e => e.itemID == items[itemOfDay].name);

                if(itemOfDay == "bank_upgrade") {
                    newAmount = profile.bankLvl + 1;

                    await client.provider.updateProfile(message.guild!.id, message.author.id, {
                        bankLvl: newAmount, coins: Math.floor(profile.coins - cost)
                    })
                }

                if(item) {
                    newAmount = item.amount + 1;

                    await sequelize.models.inventoryes.update({amount: newAmount}, {
                        where:
                            {
                                userID: message.author.id,
                                guildID: message.guild!.id,
                                itemID: itemOfDay
                            }
                    })

                    await client.provider.updateProfile(message.guild!.id, message.author.id, {
                        bankLvl: newAmount, coins: Math.floor(profile.coins - cost)
                    })
                } else {
                    if(itemOfDay !== "bank_upgrade") {

                        newAmount = 1;

                        await sequelize.models.inventoryes.create({
                            amount: newAmount,
                            userID: message.author.id,
                            guildID: message.guild!.id,
                            itemID: itemOfDay
                        })

                        await client.provider.updateProfile(message.guild!.id, message.author.id, {
                            bankLvl: newAmount, coins: Math.floor(profile.coins - cost)
                        })
                    }
                }

                if(itemOfDay == "bank_upgrade") {
                    await message.channel.send(`Вы успешно купили предмет ${items[itemOfDay].name}! Уровень сейчас: ` + newAmount)
                } else {
                    await message.channel.send(`Вы успешно купили предмет ${items[itemOfDay].name}! Количество в инвентаре: ` + newAmount)
                }
                break
            case "2":
                if(profile.coins < getCost(2, profile)) return message.channel.send("Недостаточно наличных для совершения покупки!")
                item = inventory.find(e => e.itemID == cachedIndexes[2]);

                if(cachedIndexes[2] == "bank_upgrade") {
                    newAmount = profile.bankLvl + 1;

                    await client.provider.updateProfile(message.guild!.id, message.author.id, {
                        bankLvl: newAmount, coins: Math.floor(profile.coins - getCost(2, profile))
                    })
                }

                if(item) {
                    newAmount = inventory.find(e => e.itemID == cachedIndexes[2])!.amount + 1;

                    await sequelize.models.inventoryes.update({amount: newAmount}, {
                        where: {
                            userID: message.author.id,
                            guildID: message.guild!.id,
                            itemID: cachedIndexes[2]
                        }
                    })

                    await client.provider.updateProfile(message.guild!.id, message.author.id, {
                        coins: Math.floor(profile.coins - getCost(2, profile))
                    })
                    } else {

                    if(cachedIndexes[2] !== "bank_upgrade") {
                        newAmount = 1;

                        await sequelize.models.inventoryes.create({
                            amount: newAmount,
                            userID: message.author.id,
                            guildID: message.guild!.id,
                            itemID: cachedIndexes[2]
                        })

                        await client.provider.updateProfile(message.guild!.id, message.author.id, {
                            coins: Math.floor(profile.coins - getCost(2, profile))
                        })
                      }
                    }

                    if(cachedIndexes[2] == "bank_upgrade") {
                        await message.channel.send(`Вы успешно купили предмет ${items[cachedIndexes[2]].name}! Уровень сейчас: ` + newAmount)
                    } else {
                        await message.channel.send(`Вы успешно купили предмет ${items[cachedIndexes[2]].name}! Количество в инвентаре: ` + newAmount)
                    }
                break
            case "3":
                if(profile.coins < getCost(3, profile)) return message.channel.send("Недостаточно наличных для совершения покупки!")
                item = inventory.find(e => e.itemID == cachedIndexes[3]);

                if(cachedIndexes[3] == "bank_upgrade") {
                    newAmount = profile.bankLvl + 1;

                    await client.provider.updateProfile(message.guild!.id, message.author.id, {
                        bankLvl: newAmount, coins: Math.floor(profile.coins - getCost(3, profile))
                    })
                }

                if(item) {
                    newAmount = inventory.find(e => e.itemID == cachedIndexes[3])!.amount + 1;

                    await sequelize.models.inventoryes.update({amount: newAmount}, {
                        where: {
                            userID: message.author.id,
                            guildID: message.guild!.id,
                            itemID: cachedIndexes[3]
                        }
                    })

                    await client.provider.updateProfile(message.guild!.id, message.author.id, {
                        coins: Math.floor(profile.coins - getCost(3, profile))
                    })
                } else {
                    if(cachedIndexes[3] !== "bank_upgrade") {
                        newAmount = 1;

                        await sequelize.models.inventoryes.create({
                            amount: newAmount,
                            userID: message.author.id,
                            guildID: message.guild!.id,
                            itemID: cachedIndexes[3]
                        })

                        await client.provider.updateProfile(message.guild!.id, message.author.id, {
                            coins: Math.floor(profile.coins - getCost(3, profile))
                        })
                    }
                }

                if(cachedIndexes[3] == "bank_upgrade") {
                    await message.channel.send(`Вы успешно купили предмет ${items[cachedIndexes[3]].name}! Уровень сейчас: ` + newAmount)
                } else {
                    await message.channel.send(`Вы успешно купили предмет ${items[cachedIndexes[3]].name}! Количество в инвентаре: ` + newAmount)
                }
                break
            case "4":
                if(profile.coins < getCost(4, profile)) return message.channel.send("Недостаточно наличных для совершения покупки!")
                item = inventory.find(e => e.itemID == cachedIndexes[4]);

                if(cachedIndexes[4] == "bank_upgrade") {
                    newAmount = profile.bankLvl + 1;

                    await client.provider.updateProfile(message.guild!.id, message.author.id, {
                        bankLvl: newAmount, coins: Math.floor(profile.coins - getCost(4, profile))
                    })
                }

                if(item) {
                    newAmount = inventory.find(e => e.itemID == cachedIndexes[4])!.amount + 1;

                    await sequelize.models.inventoryes.update({amount: newAmount}, {
                        where: {
                            userID: message.author.id,
                            guildID: message.guild!.id,
                            itemID: cachedIndexes[4]
                        }
                    })

                    await client.provider.updateProfile(message.guild!.id, message.author.id, {
                        coins: Math.floor(profile.coins - getCost(4, profile))
                    })
                } else {
                    if(cachedIndexes[4] !== "bank_upgrade") {
                        newAmount = 1;

                        await sequelize.models.inventoryes.create({
                            amount: newAmount,
                            userID: message.author.id,
                            guildID: message.guild!.id,
                            itemID: cachedIndexes[4]
                        })

                        await client.provider.updateProfile(message.guild!.id, message.author.id, {
                            coins: Math.floor(profile.coins - getCost(4, profile))
                        })
                    }
                }

                if(cachedIndexes[4] == "bank_upgrade") {
                    await message.channel.send(`Вы успешно купили предмет ${items[cachedIndexes[4]].name}! Уровень сейчас: ` + newAmount)
                } else {
                    await message.channel.send(`Вы успешно купили предмет ${items[cachedIndexes[4]].name}! Количество в инвентаре: ` + newAmount)
                }
                break
            case "5":
                if(profile.coins < getCost(5, profile)) return message.channel.send("Недостаточно наличных для совершения покупки!")
                item = inventory.find(e => e.itemID == cachedIndexes[5]);

                if(cachedIndexes[5] == "bank_upgrade") {
                    newAmount = profile.bankLvl + 1;

                    await client.provider.updateProfile(message.guild!.id, message.author.id, {
                        bankLvl: newAmount, coins: Math.floor(profile.coins - getCost(5, profile))
                    })
                }

                if(item) {
                    newAmount = inventory.find(e => e.itemID == cachedIndexes[5])!.amount + 1;

                    await sequelize.models.inventoryes.update({amount: newAmount}, {
                        where: {
                            userID: message.author.id,
                            guildID: message.guild!.id,
                            itemID: cachedIndexes[5]
                        }
                    })

                    await client.provider.updateProfile(message.guild!.id, message.author.id, {
                        coins: Math.floor(profile.coins - getCost(5, profile))
                    })
                } else {
                    if(cachedIndexes[5] == "bank_upgrade") {
                        newAmount = 1;

                        await sequelize.models.inventoryes.create({
                            amount: newAmount,
                            userID: message.author.id,
                            guildID: message.guild!.id,
                            itemID: cachedIndexes[5]
                        })

                        await client.provider.updateProfile(message.guild!.id, message.author.id, {
                            coins: Math.floor(profile.coins - getCost(5, profile))
                        })
                    }
                }

                if(cachedIndexes[5] == "bank_upgrade") {
                    await message.channel.send(`Вы успешно купили предмет ${items[cachedIndexes[5]].name}! Уровень сейчас: ` + newAmount)
                } else {
                    await message.channel.send(`Вы успешно купили предмет ${items[cachedIndexes[5]].name}! Количество в инвентаре: ` + newAmount)
                }
                break
            default:
                return message.channel.send('Предмета с таким идентификатором не существует!')
        }
    }
}

function getCost(index: number, profile: UserProfileData): number {
    let cost: number;

    if(cachedIndexes[index] == "bank_upgrade") {
        cost = Math.floor(10000 + (5000 * profile.bankLvl) * 1.40)
    } else {
        cost = items[cachedIndexes[index]].cost
    }

    return cost;
}

export = Buy;