import { Model, DataTypes } from "sequelize/types";
import { client } from "../main";
class Guilds extends Model {}

Guilds.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    guildID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guildName: {
        type: DataTypes.STRING
    }
},{
    sequelize: client.provider.sequelize,
    modelName: 'Guilds',
    freezeTableName: true
})

export = Guilds;