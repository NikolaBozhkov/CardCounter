import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { NavController, PopoverController } from 'ionic-angular';

import { Card } from '../card/card';
import { CardComponent } from '../card/card.component';
import { SettingsComponent } from '../settings/settings.component';

const NUM_DECKS = 4;
const DEALING_SPEED = 60;
const COUNT_MINUS_THRSH = 10;
const COUNT_PLUS_THRSH = 6;
const NUM_SUITS = 4;

@Component({
    selector: 'page-home',
    template: `<ion-header>
        <ion-toolbar>
            <ion-buttons left class="cards-group">
                <button ion-button icon-only (click)="shuffleDeck()">
                    <ion-icon name="cards" class="icon-custom icon-cards"></ion-icon>
                </button>
                <ion-badge color="accent" class="header-chip">
                    {{cardsLeft}}
                </ion-badge>
            </ion-buttons>
            <ion-title>Blackjack Count</ion-title>
            <ion-buttons right>
                <button ion-button icon-only (click)="toggleCountVisible()" [disabled]="!hasStarted">
                    <ion-icon name="visible" class="icon-custom icon-visible"></ion-icon>
                </button>
                <button ion-button icon-only (click)="presentSettings($event)">
                    <ion-icon name="settingsGear" class="icon-custom"></ion-icon>
                </button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <ion-content padding (click)="toggleDealing()" class="no-scroll">
        <card #cardComponent></card>
        <card #moveCardComponent></card>
        <div class="overlay-wrapper" *ngIf="cardComponent.isHidden">
            <div class="start-overlay">
                Tap to start
            </div>
        </div>
        <div class="overlay-wrapper" *ngIf="isCountVisible">
            <div class="count-overlay">
                <div class="overlay-header">
                    The count is
                </div>
                <span>{{count}}</span>
            </div>
        </div>
    </ion-content>`

    //templateUrl: 'home.html'
})

export class HomePage implements AfterViewInit {
    @ViewChild('cardComponent') cardComponent: CardComponent;
    @ViewChild('moveCardComponent') moveCardComponent: CardComponent;

    availableCards: Card[] = [];
    numDecks: number;
    cardsLeft: number;
    count: number;

    dealInterval: number;
    dealingSpeed: number;
    isDealing: boolean;

    isCountVisible: boolean = false;
    hasStarted: boolean = false;

    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController) {
        this.numDecks = NUM_DECKS;
        this.count = 0;
        this.dealInterval = 0;
        this.dealingSpeed = DEALING_SPEED;
        this.isDealing = false;
    }

    ngAfterViewInit() {
        this.shuffleDeck();
        this.moveCardComponent.isMovable = true;
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
        this.stopDealing();

        this.availableCards = [];
        for (let i = 2; i <= 14; i++) {
            let newCard = new Card(i, this.numDecks * NUM_SUITS);
            this.availableCards.push(newCard);
        }

        this.count = 0;
        this.cardsLeft = this.availableCards.length * this.numDecks * NUM_SUITS;
        this.cardComponent.setCard(null);
        this.moveCardComponent.setCard(null);
        this.hasStarted = false;
    }

    startDealing() {
        this.deal();
        this.isDealing = true;
        this.hasStarted = true;

        // Maximum to handle by animation
        if (this.getDealIntervalTime() < 380) {
            this.dealingSpeed = 150;
        }

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

            this.moveCardComponent.state = 'out';
            setTimeout(() => {
                this.moveCardComponent.state = 'in';
                this.moveCardComponent.setCard(card);
            }, 380);

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

    toggleCountVisible() {
        this.isCountVisible = !this.isCountVisible;
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
