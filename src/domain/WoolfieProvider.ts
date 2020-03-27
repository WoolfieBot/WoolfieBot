import sequelize = require("../models/sequelize");
import { Message } from "discord.js";

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
                return console.log(`Произошла ошибка при получении данных о сервере ID: ` + guildID)
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

    /**
     * Функция которая находит все записки в БД.
     * 
     * @param guildID строка с айди сервера.
     * @returns возвращает Promise<Object> с названием, содержимым, автором записки. 
     */
    public async getAllNotes(guildID: string) : Promise<any> {
        let data: Promise<Object> = await sequelize.models.notes.findAll({where:{guildID:guildID}})
        if(data){
            return data
        }else{
            return null;
        }
    }

    /**
     * Функция которая находит все записки определённого пользователя в БД.
     * 
     * @param guildID строка с айди сервера.
     * @param creatorID строка с идентификатором пользователя.
     * @returns возвращает Promise<Object> с названием, содержимым, автором записки. 
     */
    public async getAllUsersNote(guildID: string, creatorID: string): Promise<any> {
        let data: Promise<Object> = await sequelize.models.notes.findAll({where:{guildID:guildID,creatorID:creatorID}})
        if(data){
            return data
        }else{
            return null;
        }
    }

    /**
     * Функция которая находит одну записку определённого пользователя в БД.
     * 
     * @param guildID строка с айди сервера.
     * @param creatorID строка с идентификатором пользователя.
     * @param noteName строка с названием записки.
     * @returns возвращает Promise<Object> с названием, содержимым, автором записки. 
     */
    public async getUserNote(guildID: string, creatorID: string, noteName: string): Promise<any> {
        let data: Promise<Object> = await sequelize.models.notes.findOne({where:{guildID:guildID,creatorID:creatorID,noteName:noteName}})
        if(data){
            return data
        }else{
            return null;
        }
    }

    /**
     * Функция редактирующая записку в БД
     * 
     * @param guildID строка с айди сервера.
     * @param noteName строка с названием записки.
     * @param note строка с содержимым записки.
     * @returns возвращает Promise<boolean> = 'true' при успешном редактировании, в противном случае возвращает false с ошибкой.
     */
    public async editNote(guildID: string, noteName: string, note: string): Promise<boolean> {
        try {
            sequelize.models.notes.update({note:note},{where:{guildID:guildID,noteName:noteName}})
        } catch (error) {
            return false + error;
        }
        return true;
    }

    /**
     * Функция которая позволяет найти пользователя по его нику без упоминания, так же возможен вариант если упоминание было.
     * 
     * @param message объект сообщения, нужен для варианта с упоминанем.
     * @param toFind строка с ником пользователя которого нужно найти.
     * @returns Возвращает объект Promise<member>.
     * @example <WoolfieProvider>.getMember(message, "alowave")
     */
    public async getMember(message: Message, toFind = ''): Promise<any> {
        toFind = toFind.toLowerCase();

        let target: any = message.guild?.members.cache.get(toFind);
        
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild?.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
            
        if (!target) 
            target = message.member;
            
        return target;
    }

    /**
     * Функция удаляющая записку из БД
     * 
     * @param guildID строка с айди сервера.
     * @param noteName строка с названием записки.
     * @returns возвращает Promise<boolean> = 'true' при успешном удалении, в противном случае возвращает false с ошибкой.
     */
    public async deleteNote(guildID: string, noteName: string): Promise<boolean> {
        try {
            sequelize.models.notes.destroy({where:{guildID:guildID,noteName:noteName}})
        } catch (error) {
            return false + error;
        }
        return true;
    }

    /**
     * Функция для получения информации о профиле пользователя.
     * 
     * @param guildID строка с айди сервера.
     * @param userID строка с идентификатором пользователя.
     * @returns Возвращает Promise<Object> с данными профиля, в противном случае возвращает null.
     */
    public async getProfile(guildID: string, userID: string): Promise<any> {
        try {
            let data: Promise<object> = await sequelize.models.profiles.findOne({where:{guildID:guildID,userID:userID}})
            if(data){
                return data
            }else{
                return null
            }            
        } catch (error) {
            return console.error(error)
        }
    }

    /**
     * Функция для получения информации о профиле пользователя.
     * 
     * @param guildID строка с айди сервера.
     * @param userID строка с идентификатором пользователя.
     * @returns Возвращает Promise<Object> с данными профиля, в противном случае возвращает null.
     */
    public async createProfile(guildID: string, userID: string, username: string, userDisplayName: string, roles: string): Promise<boolean> {
        try {
            await sequelize.models.profiles.create({guildID:guildID,userID:userID,username:username,userDisplayName:userDisplayName,roles:roles})         
        } catch (error) {
            return false + error;
        }
        return true;
    }

    /**
     * Функция которая случайным образом выбирает число от минимального до максимального значения
     * 
     * @param min минимальное число.
     * @param max максимальное число (не учитывается).
     * @returns Promise<number> рандомное число.
     */
    public async getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      
      }

    /**
     * Функция для обновления профиля определенного пользователя.
     * 
     * @param guildID строка с айди сервера.
     * @param userID строка с идентификатором пользователя.
     * @param update объект с опциями обновления.
     * @returns Возвращает Promise<boolean> = true, в противном случае false с ошибкой
     */
    public async updateProfile(guildID: string, userID: string, update: object): Promise<boolean> {
        try {
            await sequelize.models.profiles.update(update,{where:{guildID:guildID,userID:userID}})
        } catch (error) {
            return false + error;
        }
        return true;
    }
    
    /**
     * Функция для обновления ранкинга определенного пользователя.
     * 
     * @param guildID строка с айди сервера.
     * @param userID строка с идентификатором пользователя.
     * @param update объект с опциями обновления.
     * @returns Возвращает Promise<boolean> = true, в противном случае false с ошибкой
     */
    public async updateRanks(guildID: string, userID: string, update: object): Promise<boolean> {
        try {
            await sequelize.models.profiles.increment(update,{where:{guildID:guildID,userID:userID}})
        } catch (error) {
            return false + error;
        }
        return true;
    }

    /**
     * Функция которая создает сервер в БД.
     * 
     * 
     */
    public async createGuild(guildID: string, guildName: string, welcomeMsg: string, welcomeChannel: string, lvlUpMsg: string, lvlUpChannel:string) {
        try {
            await sequelize.models.guilds.create({guildID:guildID,guildName:guildName,welcomeMsg:welcomeMsg,welcomeChannel:welcomeChannel,lvlUpMsg:lvlUpMsg,lvlUpChannel:lvlUpChannel})
        } catch (error) {
            return false + error;
        }
        return true;
    }
    
}

export { WoolfieProvider }