import sequelize = require("../models/sequelize");

class WoolfieProvider {

    public init() {
        require('../models/index')
    }

    /**
     * Функция которая возвращает данные о Сервере из БД.
     * 
     * @param guildID строка с айди сервера.
     * @returns Возвращает Promise<Object> с данными о сервере.
     */

    public async getGuild(guildID: string): Promise<any> {
        let data: Promise<Object> = await sequelize.models.guilds.findOne({where:{guildID:guildID}});
            if(data){
                return data
            }else{
                return console.exception(`Произошла ошибка при получении данных о сервере ID: ` + guildID)
            }
    }
    
    /**
     * Функция которая находит одну записку в БД.
     * 
     * @param guildID строка с айди сервера.
     * @param noteName строка с названием записки.
     * @returns возвращает Promise<Object> с названием, содержимым, автором записки. 
     */
    public async getNote(guildID: string, noteName: string): Promise<any> {
        let data: Promise<Object> = await sequelize.models.notes.findOne({where:{guildID:guildID,noteName:noteName}})
        if(data){
            return data
        }else{
            return null;
        }
    }

    /**
     * Функция создающая записку в БД
     * 
     * @param guildID строка с айди сервера.
     * @param noteName строка с названием записки.
     * @param note строка с содержимым записки.
     * @param creatorID строка с идентификатором создателя.
     * @returns возвращает Promise<boolean> = 'true' при успешном создании, в противном случае возвращает false с ошибкой.
     */
    public async createNote(guildID: string, noteName: string, note: string, creatorID: string): Promise<boolean> {
        try {
            sequelize.models.notes.create({guildID:guildID,noteName:noteName,note:note,creatorID:creatorID})
        } catch (error) {
            return false + error;
        }
        return true;
    }
}

export { WoolfieProvider }