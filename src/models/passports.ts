import { Model, DataTypes } from "sequelize";
import sequelize = require("./sequelize");

class Passports extends Model {}

Passports.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    guildID:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    userID:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    name:{
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    surname:{
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    birthday:{
        type: DataTypes.DATEONLY(),
        allowNull: false
    },
    age:{
        type: DataTypes.INTEGER({length:100}),
        allowNull: false
    },
    bio:{
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    photo:{
        type: DataTypes.STRING(200),
        allowNull: false
    },
    sex:{
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    law:{
        type: DataTypes.INTEGER({length:100}),
        defaultValue: 100,
        allowNull: true
    },
    driverLicense:{
        type: DataTypes.TINYINT({length:1}),
        defaultValue: 0,
        allowNull: true
    },
    work:{
        type: DataTypes.STRING(2000),
        defaultValue: null,
        allowNull: true
    },
    resume:{
        type: DataTypes.STRING(2000),
        defaultValue: null,
        allowNull: true
    },
    workLvl:{
        type: DataTypes.SMALLINT(),
        defaultValue: null,
        allowNull: true
    },
    weaponLicense:{
        type: DataTypes.SMALLINT(),
        defaultValue: 0,
        allowNull: true
    }
},{
    sequelize: sequelize,
    freezeTableName: true,
    modelName: 'passports'  
})

export = Passports;