import sequelize = require("../models/sequelize");
import { Message, GuildMember } from "discord.js";
import { UserProfileData, CooldownObject, GuildObject, NoteObject, PunishmentObject } from "./ObjectModels";
import { UnMuteWorker } from "../workers/UnMuteService";
import { client } from "../main";
import { UnBanWorker } from "../workers/UnBanService";

class WoolfieProvider {

    public init() {
        //Инициация моделей
        require('../models/index')

        //Запуск воркеров
        new UnMuteWorker().setWorker(client);
        new UnBanWorker().setWorker(client);
    }

    /**
     * Функция которая возвращает данные о Сервере из БД.
     * 
     * @param guildID строка с айди сервера.
     * @returns Возвращает Promise<Object> с данными о сервере.
     */

    public async getGuild(guildID: string): Promise<GuildObject> {
        var data: Promise<GuildObject> = new Promise((resolve,reject) => {resolve(undefined)});
        try {
            data = await sequelize.models.guilds.findOne({where:{guildID:guildID}});
        } catch (error) {
            return data + error;
        }
        return data;
    }
    
    /**
     * Функция которая находит одну записку в БД.
     * 
     * @param guildID строка с айди сервера.
     * @param noteName строка с названием записки.
     * @returns возвращает Promise<Object> с названием, содержимым, автором записки. 
     */
    public async getNote(guildID: string, noteName: string): Promise<NoteObject> {
        var data: Promise<NoteObject> = new Promise((resolve,reject) => {resolve(undefined)});
        try {
            data = await sequelize.models.notes.findOne({where:{guildID:guildID,noteName:noteName}}) 
        } catch (error) {
            return data + error;
        }
        return data;
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
     * @returns возвращает Promise<Array<NoteObject>> с названием, содержимым, автором записки. 
     */
    public async getAllNotes(guildID: string) : Promise<Array<NoteObject>> {
        var data: Promise<Array<NoteObject>> = new Promise((resolve,reject) => {resolve(undefined)});        
        try {
            data = await sequelize.models.notes.findAll({where:{guildID:guildID}}) 
        } catch (error) {
            return data + error;
        }
        return data;
    }

    /**
     * Функция которая находит все записки определённого пользователя в БД.
     * 
     * @param guildID строка с айди сервера.
     * @param creatorID строка с идентификатором пользователя.
     * @returns возвращает Promise<Array<NoteObject>> с названием, содержимым, автором записки.
     */
    public async getAllUsersNote(guildID: string, creatorID: string): Promise<Array<NoteObject>> {
        var data: Promise<Array<NoteObject>> = new Promise((resolve,reject) => {resolve(undefined)});
        try {
            data = await sequelize.models.notes.findAll({where:{guildID:guildID,creatorID:creatorID}})
        } catch (error) {
            return data + error;
        }
        return data;
    }

    /**
     * Функция которая находит одну записку определённого пользователя в БД.
     * 
     * @param guildID строка с айди сервера.
     * @param creatorID строка с идентификатором пользователя.
     * @param noteName строка с названием записки.
     * @returns возвращает Promise<Object> с названием, содержимым, автором записки. 
     */
    public async getUserNote(guildID: string, creatorID: string, noteName: string): Promise<NoteObject> {
        var data: Promise<NoteObject> = new Promise((resolve,reject) => {resolve(undefined)});
        try {
            data = await sequelize.models.notes.findOne({where:{guildID:guildID,creatorID:creatorID,noteName:noteName}})
        } catch (error) {
            return data + error;
        }
        return data;
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
     * @example getMember(<Message>, "alowave")
     */
    public async getMember(message: Message, toFind = ''): Promise<GuildMember> {
        toFind = toFind.toLowerCase();

        let target: GuildMember | undefined = message.guild?.members.cache.get(toFind);
        
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild?.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
            
        if (!target)
            target = <GuildMember>message.member;
            
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
    public async getProfile(guildID: string, userID: string): Promise<UserProfileData> {
        var data: Promise<UserProfileData> = new Promise((resolve,reject) => {resolve(undefined)});
        try {            
            data = await sequelize.models.profiles.findOne({where:{guildID:guildID,userID:userID}});
        } catch (error) {
            return data + error;
        }
        return data;
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
    public async getRandomInt(min: number, max: number): Promise<number> {
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
     * @param guildID строка с идентификатором сервера.
     * @param guildName строка с наименованием сервера.
     * @param welcomeMsg строка с текстом приветствия для сервера.
     * @param lvlUpMsg строка с текстом поздравления с новым уровнем пользоваетля.
     * @param lvlUpChannel строка с идентификатором сервера
     * @returns Возвращает Promise<boolean> = true при успешном создании сервера, в противном случае false с ошибкой.
     */
    public async createGuild(guildID: string, guildName: string, welcomeMsg: string, welcomeChannel: string, lvlUpMsg: string, lvlUpChannel:string): Promise<boolean> {
        try {
            await sequelize.models.guilds.create({guildID:guildID,guildName:guildName,welcomeMsg:welcomeMsg,welcomeChannel:welcomeChannel,lvlUpMsg:lvlUpMsg,lvlUpChannel:lvlUpChannel})
        } catch (error) {
            return false + error;
        }
        return true;
    }

    /**
     * Функция позволяющая создать кулдаун для пользователя.
     * 
     * @param guildID строка с идентификатором сервера.
     * @param userID строка с идентификатором пользователя.
     * @param cooldownType строка с названием типом кулдауна.
     * @param expiresAt строка с DateTime в ISO истечения кулдауна.
     * @returns Возвращает Promise<boolean> = true при успешном создании кулдауна, в противном случае false с ошибкой.
     */
    public async createCooldown(guildID: string, userID: string, cooldownType: string, expiresAt: string): Promise<boolean> {
        try {
            await sequelize.models.cooldowns.create({guildID:guildID,userID:userID,cooldownType:cooldownType,expiresAt:expiresAt})
        } catch (error) {
            return false + error;
        }
        return true;
    }

    /**
     * Функция для получения кулдауна пользователя.
     * 
     * @param guildID строка с айди сервера.
     * @param userID строка с идентификатором пользователя.
     * @param cooldownType строка с типом кулдауна.
     * @returns Возвращает Promise<CooldownObject> с данными кулдауна, в противном случае возвращает undefined.
     */
    public async getCooldown(guildID: string, userID: string, cooldownType: string): Promise<CooldownObject> {
        var data: Promise<CooldownObject> = new Promise((resolve,reject) => {resolve(undefined)});
        try {
            data = await sequelize.models.cooldowns.findOne({where:{guildID:guildID,userID:userID,cooldownType:cooldownType}})            
        } catch (error) {
            return data + error;
        }
        return data;
    }

    /**
     * Функция позволяющая удалить кулдаун пользователя из БД.
     * 
     * @param guildID строка с идентификатором сервера.
     * @param userID строка с идентификатором пользователя.
     * @param cooldownType строка с типом кулдауна.
     * @example deleteCooldown(<Guild>.id,<GuildMember>.id,"DAILY") //true при успешном удалении false при ошибке.
     */
    public async deleteCooldown(guildID: string, userID: string, cooldownType: string): Promise<boolean> {
        try {
            await sequelize.models.cooldowns.destroy({where:{guildID:guildID,userID:userID,cooldownType:cooldownType}})
        } catch (error) {
            return false + error;
        }
        return true;
    }

    /**
     * Функция для получения информации из паспорта пользователя.
     * 
     * @param guildID строка с идентификатором сервера. 
     * @param userID строка с идентификатором пользователя.
     * @returns Promise<CooldownObject> с информацией из паспорта пользователя.
     */
    public async getPassportInfo(guildID: string, userID: string): Promise<object> {
        var data: Promise<object> = new Promise((resolve,reject) => {resolve(undefined)});
        try {
            data = await sequelize.models.passports.findOne({where:{guildID:guildID,userID:userID}})
        } catch (error) {
            return data + error;
        }
        return data;
    }

    /**
     * Функция позволяющая обновить данные паспорта пользователя.
     * 
     * @param guildID строка с идентификатором сервера.
     * @param userID строка с идентификатором пользователя.
     * @param updateObject объект с обновлением.
     * @example updatePassportInfo(<guild>!.id,<user>!.id,{age:28})
     * @returns Promise<boolean> при успешном обновлении информации, в противном случае false.
     */
    public async updatePassportInfo(guildID: string, userID: string, cooldownType: string): Promise<boolean> {
        try {
            await sequelize.models.cooldowns.destroy({where:{guildID:guildID,userID:userID,cooldownType:cooldownType}})
        } catch (error) {
            return false + error;
        }
        return true;
    }

    /**
     * Функция которая создает паспорт в БД.
     * 
     * @param guildID строка с идентификатором сервера.
     * @param userID строка с идентификатором пользователя.
     * @param name строка с игровым именем пользователя.
     * @param surname строка с игровой фамилией пользователя.
     * @param birthday строка с игровой датой рождения пользователя. Пример: 2020-02-19.
     * @param sex число с игровым полом пользователя. Пример: 0 = Мужской, 1 = Женский.
     * @param age строка с игровым возрастом пользователя.
     * @param bio строка с игровой краткой биографией пользователя.
     * @param photo строка с сылкой на игровую фотографию паспорта пользователя.
     * @returns Promise<boolean> true при успешном создании паспорта, в противном случае false.
     */
    public async createPassport(guildID: string, userID: string, name: string, surname: string, birthday: string, sex: number, age: string, bio: string, photo: string): Promise<boolean> {
        try {
            await sequelize.models.passports.create({guildID:guildID,userID:userID,name:name,surname:surname,birthday:birthday,sex:sex,age:age,bio:bio,photo:photo})
        } catch (error) {
            return false + error;
        }
        return true;
    }

    public async getActivePunishments(punishmentType: string): Promise<Array<PunishmentObject>> {
        var data: Promise<Array<PunishmentObject>> = new Promise((resolve,reject) => {undefined});
        try {
            data = await sequelize.models.Punishments.findAll({where:{active:1,type:punishmentType}});
        } catch(error) {
            return false + error;
        }
        if(data) return data;
        return data;
    }

    public async getUserActivePunishment(guildID: string, punishmentType: string, userID: string): Promise<PunishmentObject> {
        var data: Promise<PunishmentObject> = new Promise((resolve,reject) => {undefined});
        try {
            data = await sequelize.models.Punishments.findOne({where:{guildID:guildID,active:1,type:punishmentType,punishableID:userID}});
        } catch(error) {
            return false + error;
        }
        if(data) return data;
        return data;
    }

    public async getAllPunishments(guildID: string): Promise<Array<PunishmentObject>> {
        var data: Promise<Array<PunishmentObject>> = new Promise((resolve,reject) => {undefined});
        try {
            data = await sequelize.models.Punishments.findAll({where:{guildID:guildID}});
        } catch(error) {
            return false + error;
        }
        if(data) return data;
        return data;
    }

    public async ifAdminRole(guildID: string, authorID: string): Promise<Boolean> {
        let data: GuildObject = await client.provider.getGuild(guildID);
        let result: Promise<boolean> = new Promise((resolve) => {
            resolve(false)
        });
        try {
            if (!data.adminRoles) return result;
            data.adminRoles?.split(" ").forEach(e => {
                let guild = client.guilds.cache.get(guildID);
                let user = guild?.members.cache.get(authorID);
                if(user?.roles.cache.has(e)) {
                 return result = new Promise((resolve) => {resolve(true)});
                }
            });
        } catch (error) {
            return false + error;
        }
        return result;
    }

    public async ifModerRole(guildID: string, authorID: string): Promise<Boolean> {
        let data: GuildObject = await client.provider.getGuild(guildID);
        let result: Promise<boolean> = new Promise((resolve) => {
            resolve(false)
        });
        try {
            if (!data.moderatorRoles) return result;
            data.moderatorRoles?.split(" ").forEach(e => {
                let guild = client.guilds.cache.get(guildID);
                let user = guild?.members.cache.get(authorID);
                if(user?.roles.cache.has(e)) {
                    return result = new Promise((resolve) => {resolve(true)})
                }
            });
        } catch (error) {
            return false + error;
        }
        return result;
    }

    public async createPunisment(guildID: string, punishableID: string, producerID: string, type: string, reason: string, expiresAt: string): Promise<boolean> {
        try {
            sequelize.models.Punishments.create({guildID: guildID, punishableID: punishableID, producerID: producerID, type: type, reason: reason, expiresAt: expiresAt})
        } catch (error) {
          return false + error;
        }
        return true;
    }
}

export { WoolfieProvider }