import { Model, DataTypes } from "sequelize";
import sequelize = require("./sequelize");

class Profiles extends Model {}

Profiles.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    guildID:{
        type: DataTypes.STRING,
        allowNull: false
    },
    userID:{
        type: DataTypes.STRING,
        allowNull: false
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false
    },
    userDisplayName:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    roles:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    about:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'хто я?'
    },
    coins:{
        type: DataTypes.INTEGER({length:100}),
        allowNull: true,
        defaultValue: 0
    },
    bank:{
        type: DataTypes.INTEGER({length:100}),
        allowNull: true,
        defaultValue: 0
    },
    bankLvl:{
        type: DataTypes.INTEGER({length:20}),
        allowNull: true,
        defaultValue: 1
    },
    lvl:{
        type: DataTypes.INTEGER({length:20}),
        allowNull: true,
        defaultValue: 0
    },
    xp:{
        type: DataTypes.INTEGER({length:255}),
        allowNull: true,
        defaultValue: 0
    },
    reputation:{
        type: DataTypes.STRING(2000),
        allowNull: true,
        defaultValue: 0
    },
    lastActivityMessageChannel:{
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
    },
    lastActivityVoice:{
        type: DataTypes.DATE(),
        allowNull: true,
        defaultValue: null
    },
    lastActivityVoiceChannel:{
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
    },
    isBlackListed:{
        type: DataTypes.TINYINT(),
        allowNull: true,
        defaultValue: 0
    }
},{
    sequelize: sequelize,
    freezeTableName: true,
    modelName: 'profiles'
})

export = Profiles;