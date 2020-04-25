import { Model, DataTypes } from "sequelize";
import sequelize = require("./sequelize");

class Guilds extends Model {}

Guilds.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true
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
        allowNull: true
    },
    welcomeMsg: {
        type: DataTypes.STRING(2000),
        allowNull: true
    },
    welcomeChannel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lvlUpMsg: {
        type: DataTypes.STRING(2000),
        allowNull: true
    },
    lvlUpEmbed: {
        type: DataTypes.INTEGER({length: 1}),
        allowNull: true
    },
    lvlUpChannel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isLvl: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    isBlackListed:{
        type:DataTypes.TINYINT(),
        allowNull: true,
        defaultValue: 0
    }
},{
    sequelize: sequelize,
    modelName: 'guilds',
    freezeTableName: true
})

export = Guilds;