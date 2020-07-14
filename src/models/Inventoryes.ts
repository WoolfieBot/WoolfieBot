import { Model, DataTypes } from "sequelize";
import sequelize = require("./sequelize");

class Inventoryes extends Model {}

Inventoryes.init({
    id:{
        type: DataTypes.INTEGER({length: 11}),
        primaryKey: true,
        allowNull: true
    },
    guildID:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    userID:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    itemID:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    amount:{
        type: DataTypes.INTEGER({length: 11}),
        allowNull: true,
        defaultValue: 1
    },
    lastUse:{
        type: DataTypes.DATE(),
        allowNull: true,
        defaultValue: null
    }
},
{
    sequelize: sequelize,
    modelName: 'inventoryes',
    freezeTableName: true
})

export = Inventoryes;