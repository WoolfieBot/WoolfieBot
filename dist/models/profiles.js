"use strict";
const sequelize_1 = require("sequelize");
const sequelize = require("./sequelize");
class Profiles extends sequelize_1.Model {
}
Profiles.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    guildID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userDisplayName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    roles: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    coins: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
    },
    bank: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
    },
    bankLvl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 1
    },
    lvl: {
        type: sequelize_1.DataTypes.INTEGER({ length: 20 }),
        allowNull: true,
        defaultValue: 0
    },
    xp: {
        type: sequelize_1.DataTypes.STRING(2000),
        allowNull: true,
        defaultValue: 0
    },
    reputation: {
        type: sequelize_1.DataTypes.STRING(2000),
        allowNull: true,
        defaultValue: 0
    },
    lastActivityMessageChannel: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
    },
    lastActivityVoice: {
        type: sequelize_1.DataTypes.DATE(),
        allowNull: true,
        defaultValue: null
    },
    lastActivityVoiceChannel: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize: sequelize,
    freezeTableName: true,
    modelName: 'profiles'
});
module.exports = Profiles;
