import { Sequelize } from 'sequelize';

class WoolfieProvider {
    public sequelize: Sequelize = new Sequelize('bot','root','',{
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    })

    constructor() {
        
    }

    /**
     * @description Главная функция, которая производит инициацию бота и всех его модулей.
     */
    public Init() {
        
    }
}

export { WoolfieProvider }