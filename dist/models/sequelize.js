"use strict";
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('bot', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
        timestamps: false
    }
});
module.exports = sequelize;
