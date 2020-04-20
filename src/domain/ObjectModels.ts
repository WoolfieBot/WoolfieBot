interface CooldownObjectData {
    id: number;
    guildID: string;
    userID: string;
    cooldownType: string;
    createdAt: Date;
    expiresAt: Date;
}

export class CooldownObject {

    readonly id: number;
    readonly guildID: string;
    readonly userID: string;
    readonly cooldownType: string;
    readonly createdAt: Date;
    readonly expiresAt: Date;

    constructor(data: CooldownObjectData) {

        this.id = data.id;
        this.guildID = data.guildID;
        this.userID = data.userID;
        this.cooldownType = data.cooldownType;
        this.createdAt = data.createdAt;
        this.expiresAt = data.expiresAt;        
    }
}

interface CooldownObjectData {
    id: number;
    guildID: string;
    guildName: string;
    prefix?: string | null;
    welcomeMsg: string;
    welcomeChannel: string;
    lvlUpMsg: string;
    lvlUpEmbed?: number | null;
    lvlUpChannel: string;
    isLvl?: number | null;
}

export class GuildObject {

   readonly id: number;
   readonly guildID: string;
   readonly guildName: string;
   readonly prefix: string | null;
   readonly welcomeMsg: string;
   readonly welcomeChannel: string;
   readonly lvlUpMsg: string;
   readonly lvlUpEmbed: number | null;
   readonly lvlUpChannel: string;
   readonly isLvl: number | null;

    constructor(data: CooldownObjectData) {

        this.id = data.id;
        this.guildID = data.guildID;
        this.guildName = data.guildName;
        this.prefix = data.prefix ? data.prefix : ">";
        this.welcomeMsg = data.welcomeMsg;
        this.welcomeChannel = data.welcomeChannel;
        this.lvlUpMsg = data.lvlUpMsg;
        this.lvlUpEmbed = data.lvlUpEmbed ? data.lvlUpEmbed : 0;
        this.lvlUpChannel = data.lvlUpChannel;
        this.isLvl = data.isLvl ? data.isLvl : 0;
    }
}

interface ProfileData {
    id: number;
    guildID: string;
    userID: string;
    username: string;
    userDisplayName?: string | null;
    roles?: string | null;
    about: string;
    coins: number;
    bank: number;
    bankLvl: number;
    lvl: number;
    xp: number;
    reputation: string;
    lastActivityMessageChannel?: string | null;
    lastActivityVoice?: Date | null;
    lastActivityVoiceChannel?: string | null;
}

export class UserProfileData {

   readonly id: number;
   readonly guildID: string;
   readonly userID: string;
   readonly username: string;
   readonly userDisplayName: string;
   readonly roles: string;
   readonly about: string;
   readonly coins: number;
   readonly bank: number;
   readonly bankLvl: number;
   readonly lvl: number;
   readonly xp: number;
   readonly reputation: string;
   readonly lastActivityMessageChannel: string;
   readonly lastActivityVoice: Date;
   readonly lastActivityVoiceChannel: string;

    constructor(data: ProfileData) {
        
        this.id = data.id;
        this.guildID = data.guildID;
        this.userID = data.userID;
        this.username = data.username;
        this.userDisplayName = data.userDisplayName ? data.userDisplayName : "";
        this.roles = data.roles ? data.roles : "";
        this.about = data.about;
        this.coins = data.coins;
        this.bank = data.bank;
        this.bankLvl = data.bankLvl;
        this.lvl = data.lvl;
        this.xp = data.xp;
        this.reputation = data.reputation;
        this.lastActivityMessageChannel = data.lastActivityMessageChannel ? data.lastActivityMessageChannel : "";
        this.lastActivityVoice = data.lastActivityVoice ? data.lastActivityVoice : new Date(0);
        this.lastActivityVoiceChannel = data.lastActivityVoiceChannel ? data.lastActivityVoiceChannel : "";
    }
}

interface NoteObjectData {
    id: number;
    guildID: string;
    creatorID: string;
    noteName: string;
    note: string;
}

export class NoteObject {

   readonly id: number;
   readonly guildID: string;
   readonly creatorID: string;
   readonly noteName: string;
   readonly note: string;

    constructor(data: NoteObjectData) {

        this.id = data.id;
        this.guildID = data.guildID;
        this.creatorID = data.creatorID;
        this.noteName = data.noteName;
        this.note = data.note;
    }
}

interface PassportObjectData {
    id: number;
    guildID: string;
    userID: string;
    name: string;
    surname: string;
    birthday: Date;
    age: number;
    bio: string;
    photo: string;
    sex: number;
    law: number | null;
    driverLicense: number;
    work: string | null;
    resume: string | null;
    workLvl: number | null;
    weaponLicense: number;
}

export class PassportObject {

   readonly id: number;
   readonly guildID: string;
   readonly userID: string;
   readonly name: string;
   readonly surname: string;
   readonly birthday: Date;
   readonly age: number;
   readonly bio: string;
   readonly photo: string;
   readonly sex: number;
   readonly law: number | null;
   readonly driverLicense: number;
   readonly work: string | null;
   readonly resume: string | null;
   readonly workLvl: number | null;
   readonly weaponLicense: number;

    constructor(data: PassportObjectData) {

        this.id = data.id;
        this.guildID = data.guildID;
        this.userID = data.userID;
        this.name = data.name;
        this.surname = data.name;
        this.birthday = data.birthday;
        this.age = data.age;
        this.bio = data.bio;
        this.photo = data.photo;
        this.sex = data.sex;
        this.law = data.law ? data.law : 100;
        this.driverLicense = data.driverLicense ? data.driverLicense : 0;
        this.work = data.work ? data.work : null;
        this.resume = data.resume ? data.resume : null;
        this.workLvl = data.workLvl ? data.workLvl : null;
        this.weaponLicense = data.weaponLicense ? data.weaponLicense : 0;
    }

}

interface PunishmentObjectData {
    id: number;
    guildID: string;
    punishableID: string;
    producerID: string;
    type: string;
    reason: string;
    active: number;
    punishedAt: Date;
    expiresAt: Date;
}

export class PunishmentObject {

    readonly id: number;
    readonly guildID: string;
    readonly punishableID: string;
    readonly producerID: string;
    readonly type: string;
    readonly reason: string;
    readonly active: number;
    readonly punishedAt: Date;
    readonly expiresAt: Date;

    constructor(data: PunishmentObjectData) {
        this.id = data.id;
        this.guildID = data.guildID;
        this.punishableID = data.punishableID;
        this.producerID = data.producerID;
        this.type = data.type;
        this.reason = data.reason;
        this.active = data.active;
        this.punishedAt = data.punishedAt;
        this.expiresAt = data.expiresAt;
    }
}