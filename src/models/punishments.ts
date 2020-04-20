import { Model, DataTypes } from "sequelize";
import sequelize = require("./sequelize");

class Punishments extends Model {}

Punishments.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    guildID:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    punishableID:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    producerID:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    type:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    reason:{
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    active:{
        type: DataTypes.TINYINT({length:1}),
        defaultValue: 1,
        allowNull: true
    },
    punishedAt:{
        type: DataTypes.DATE(),
        allowNull: false
    },
    expiresAt:{
        type: DataTypes.DATE(),
        allowNull: false
    }
},{
    sequelize: sequelize,
    freezeTableName: true,
    tableName: 'Punishments'
})

export = Punishments;