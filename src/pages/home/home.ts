import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { NavController, PopoverController } from 'ionic-angular';

import { Card } from '../card/card';
import { CardComponent } from '../card/card.component';
import { SettingsComponent } from '../settings/settings.component';
import { SettingsService } from '../settings/settings.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [SettingsService]
})
export class HomePage implements AfterViewInit {
    @ViewChild('cardComponent') cardComponent: CardComponent;

    availableCards: Card[] = [];
    cardsLeft: number;
    count: number;
    dealInterval: number = 0;
    numDecks: number = 4;
    dealIntervalSpeed: number = 60;

    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public settingsService: SettingsService) {
        this.shuffleDeck();
        this.cardsLeft = this.numDecks * 52;
        this.count = 0;
    }

    getDealIntervalTime() {
        return (60 / this.dealIntervalSpeed) * 1000 // ms per card
    }

    ngAfterViewInit() {
        this.nextCard();
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
        for (let i = 2; i <= 14; i++) {
            let newCard = new Card(i, this.numDecks * 4);
            this.availableCards.push(newCard);
        }

        this.count = 0;
    }

    startCounting() {
        this.deal();

        this.dealInterval = setInterval(() => {
            this.deal();
        }, this.getDealIntervalTime());
    }

    stopCounting() {
        clearInterval(this.dealInterval);
        this.dealInterval = 0;
    }

    deal() {
        let card = this.nextCard();

        if (card) {
            this.cardComponent.setCard(card);

            if (card.num <= 6) {
                this.count += 1;
            } else if (card.num >= 10) {
                this.count -= 1;
            }
        } else {
            this.stopCounting();
        }
    }

    toggleDealing() {
        console.log('stoppppp');
        if (this.dealInterval) {
            console.log('stop');
            this.stopCounting();
        } else {
            console.log('start');
            this.startCounting();
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
