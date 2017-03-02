import { Suit } from './suit';

export class Card {
    symbol: string;
    currentSuit: string;
    currentColor: string;
    suitsLeft: { suit: Suit, numLeft: number }[];
    numLeft: number;
    num: number;

    constructor(num: number, numLeft: number) {
        if (num <= 10) {
            this.symbol = num.toString();
        } else if (num == 11) {
            this.symbol = 'J';
        } else if (num == 12) {
            this.symbol = 'Q';
        } else if (num == 13) {
            this.symbol = 'K';
        } else {
            this.symbol = 'A';
        }

        this.num = num;
        this.numLeft = numLeft;
        let suitLeft = numLeft / 4;
        this.suitsLeft = [{ suit: Suit.Spades, numLeft: suitLeft }, { suit: Suit.Clubs, numLeft: suitLeft },
            { suit: Suit.Diamonds, numLeft: suitLeft }, { suit: Suit.Hearts, numLeft: suitLeft }];
    }

    setCurrentSuit(suit: Suit) {
        this.currentSuit = Suit[suit].toLowerCase();
        console.log(this.currentSuit);
        if (suit == Suit.Spades || suit == Suit.Clubs) {
            this.currentColor = "white";
        } else {
            this.currentColor = "red";
        }
    }
}
