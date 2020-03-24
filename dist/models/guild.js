"use strict";
const sequelize_1 = require("sequelize");
const sequelize = require("./sequelize");
class Guilds extends sequelize_1.Model {
}
Guilds.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    guildID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    guildName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    prefix: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    welcomeMsg: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    welcomeChannel: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    lvlUpMsg: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    lvlUpEmbed: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    lvlUpChannel: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    isLvl: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize: sequelize,
    modelName: 'guilds',
    freezeTableName: true
});
module.exports = Guilds;
