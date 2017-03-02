import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { NavController, PopoverController } from 'ionic-angular';

import { Card } from '../card/card';
import { CardComponent } from '../card/card.component';
import { SettingsComponent } from '../settings/settings.component';

const NUM_DECKS = 4;
const NUM_CARDS = 52;
const DEALING_SPEED = 60;
const COUNT_MINUS_THRSH = 10;
const COUNT_PLUS_THRSH = 6;
const NUM_SUITS = 4;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage implements AfterViewInit {
    @ViewChild('cardComponent') cardComponent: CardComponent;

    availableCards: Card[] = [];
    cardsLeft: number;
    count: number;
    dealInterval: number;
    numDecks: number;
    dealingSpeed: number;
    isDealing: boolean;

    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController) {
        this.numDecks = NUM_DECKS;
        this.count = 0;
        this.dealInterval = 0;
        this.dealingSpeed = DEALING_SPEED;
        this.isDealing = false;
    }

    ngAfterViewInit() {
        this.shuffleDeck();
    }

    getDealIntervalTime() {
        return (60 / this.dealingSpeed) * 1000 // ms per card
    }

    nextCard() : Card {
        if (this.availableCards.length > 0) {
            let card = this.availableCards[Math.floor(Math.random() * this.availableCards.length)];
            card.numLeft -= 1;
            let index = Math.floor(Math.random() * card.suitsLeft.length);
            let suit = card.suitsLeft[index];
            card.setCurrentSuit(suit.suit);
            suit.numLeft -= 1;
            this.cardsLeft -= 1;

            if (suit.numLeft == 0) {
                card.suitsLeft.splice(card.suitsLeft.indexOf(suit), 1);
            }

            if (card.numLeft == 0) {
                this.availableCards.splice(this.availableCards.indexOf(card), 1);
            }

            return card;
        } else {
            return null;
        }
    }

    /**
    * Resets all cards and nullifies the current card
    */
    shuffleDeck() {
        clearInterval(this.dealInterval);
        
        this.availableCards = [];
        for (let i = 2; i <= 14; i++) {
            let newCard = new Card(i, this.numDecks * NUM_SUITS);
            this.availableCards.push(newCard);
        }

        this.count = 0;
        this.cardsLeft = this.availableCards.length * this.numDecks * NUM_SUITS;
        this.cardComponent.setCard(null);
    }

    startDealing() {
        this.deal();
        this.isDealing = true;

        this.dealInterval = setInterval(() => {
            this.deal();
        }, this.getDealIntervalTime());
    }

    stopDealing() {
        clearInterval(this.dealInterval);
        this.isDealing = false;
    }

    deal() {
        let card = this.nextCard();

        if (card) {
            this.cardComponent.setCard(card);

            if (card.num <= COUNT_PLUS_THRSH) {
                this.count += 1;
            } else if (card.num >= COUNT_MINUS_THRSH) {
                this.count -= 1;
            }
        } else {
            this.stopDealing();
        }
    }

    toggleDealing() {
        if (this.isDealing) {
            this.stopDealing();
        } else {
            this.startDealing();
        }
    }

    presentSettings(event) {
        let popover = this.popoverCtrl.create(SettingsComponent, {
            homePage: this
        });

        popover.present({
            ev: event
        });
    }
}
