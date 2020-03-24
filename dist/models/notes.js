"use strict";
const sequelize_1 = require("sequelize");
const sequelize = require("./sequelize");
class Notes extends sequelize_1.Model {
}
Notes.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    guildID: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false
    },
    creatorID: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false
    },
    noteName: {
        type: sequelize_1.DataTypes.STRING(2000),
        allowNull: false
    },
    note: {
        type: sequelize_1.DataTypes.STRING(2000),
        allowNull: false
    }
}, {
    sequelize: sequelize,
    modelName: 'notes',
    freezeTableName: true
});
module.exports = Notes;
