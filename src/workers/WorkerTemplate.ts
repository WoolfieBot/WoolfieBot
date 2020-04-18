import { WoolfieClient } from "../domain/WoolfieClient";

interface WorkerData {
    name: string;
    timeSecond?: number;
    timeMinute?: number;
    timeHour?: number;
}

export class SimpleWorker {

    readonly name: string;
    readonly timeSecond: number;
    readonly timeMinute: number;
    readonly timeHour: number;

    constructor(data: WorkerData) {
        this.name = data.name;

        this.timeSecond = data.timeSecond ? data.timeSecond : 0;

        this.timeMinute = data.timeMinute ? data.timeMinute : 0;
        
        this.timeHour = data.timeHour ? data.timeHour : 0;
    }

   public setWorker(client: WoolfieClient): void {
        throw new Error('Метод не предусмотрен.');
   }
}