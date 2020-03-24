"use strict";
const types_1 = require("sequelize/types");
const main_1 = require("../main");
class Guilds extends types_1.Model {
}
Guilds.init({
    id: {
        type: types_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    guildID: {
        type: types_1.DataTypes.STRING,
        allowNull: false
    },
    guildName: {
        type: types_1.DataTypes.STRING
    }
}, {
    sequelize: main_1.client.provider.sequelize,
    modelName: 'Guilds',
    freezeTableName: true
});
module.exports = Guilds;
