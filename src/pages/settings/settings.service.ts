export class SettingsService {

    numDecks: number;
    dealIntervalSpeed: number; // cards per minute

    constructor() {
        this.numDecks = 4;
        this.dealIntervalSpeed = 60;
    }

    getDealIntervalTime() {
        return (60 / this.dealIntervalSpeed) * 1000 // ms per card
    }
}
