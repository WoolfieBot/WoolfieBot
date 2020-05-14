import { Sequelize } from "sequelize";

const sequelize: Sequelize = new Sequelize('bot', 'root', '',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
        timestamps: false
    }
})

export = sequelize;