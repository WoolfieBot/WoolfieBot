import { WoolfieClient } from './domain/WoolfieClient';
import { config } from 'dotenv';
config({ path: "../.env"});
const client: WoolfieClient = new WoolfieClient(process.env.TOKEN);
client.provider.init()
const PREFIX: string = ">";
export { client, PREFIX };