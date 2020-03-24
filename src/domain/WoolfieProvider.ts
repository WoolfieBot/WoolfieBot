import sequelize = require("../models/sequelize");

class WoolfieProvider {

    public init() {
        require('../models/index')
    }

    /**
     * @description Функция которая возвращает данные о Сервере из БД.
     * @params guildID строка с айди сервера.
     * @returns Возвращает Promise<Object>.
     */

    public async getGuild(guildID: string): Promise<any> {
        let data: Promise<Object> = await sequelize.models.guilds.findOne({where:{guildID:guildID}});
            if(data){
                return data
            }else{
                return console.exception(`Произошла ошибка при получении данных о сервере ID: ` + guildID)
            }
    } 
}

export { WoolfieProvider }