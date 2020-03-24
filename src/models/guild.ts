import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize = require("./sequelize");

class Guilds extends Model {}

Guilds.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    guildID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guildName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prefix: {
        type: DataTypes.STRING,
        allowNull: false
    },
    welcomeMsg: {
        type: DataTypes.STRING,
        allowNull: true
    },
    welcomeChannel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lvlUpMsg: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lvlUpEmbed: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lvlUpChannel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isLvl: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    sequelize: sequelize,
    modelName: 'guilds',
    freezeTableName: true
})

export = Guilds;