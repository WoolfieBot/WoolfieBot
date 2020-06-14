import { Model, DataTypes } from "sequelize";
import sequelize = require("./sequelize");

class Playlists extends Model {}

Playlists.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    name:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    userID:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    guildID:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    title:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    url:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    duration:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    author:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    thumb:{
        type: DataTypes.TEXT(),
        allowNull: false
    },
    height:{
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    width:{
        type: DataTypes.INTEGER(),
        allowNull: false
    }
},
{
    sequelize: sequelize,
    modelName: 'playlists',
    freezeTableName: true
})

export = Playlists;