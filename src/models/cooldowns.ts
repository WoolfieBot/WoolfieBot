import { Model, DataTypes } from "sequelize";
import sequelize = require("./sequelize");

class Cooldowns extends Model {}

Cooldowns.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    guildID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userID:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cooldownType:{
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt:{
        type: DataTypes.DATE(),
        allowNull: true
    },
    expiresAt:{
        type: DataTypes.DATE(),
        allowNull: false
    }
},{
    sequelize: sequelize,
    modelName: 'cooldowns',
    freezeTableName: true
})

export = Cooldowns;