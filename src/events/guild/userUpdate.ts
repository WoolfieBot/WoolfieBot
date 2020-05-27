import {WoolfieClient} from "../../domain/WoolfieClient";
import {User} from "discord.js";

export = async(client: WoolfieClient, oldUser: User, newUser: User): Promise<void> => {
    if(newUser.username != oldUser.username) {
        await client.provider.updateProfile("all",newUser.id,{username: newUser.username})
    }
}