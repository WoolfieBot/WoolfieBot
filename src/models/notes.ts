import { Model, DataTypes } from "sequelize";
import sequelize = require("./sequelize");

class Notes extends Model {}

Notes.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    guildID:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    creatorID:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    noteName:{
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    note:{
        type: DataTypes.STRING(2000),
        allowNull: false
    }
},
{
    sequelize: sequelize,
    modelName: 'notes',
    freezeTableName: true
})

export = Notes;