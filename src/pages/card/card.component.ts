import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Card } from './card';

import * as $ from 'jquery';

@Component({
    selector: 'card',
    templateUrl: 'card.component.html'
})
export class CardComponent implements AfterViewChecked {
    @ViewChild('cardContainer') cardContainer: ElementRef;
    @ViewChild('cardView') cardView: ElementRef;

    private card: Card = new Card(2, 4); // setup mock card to init view
    suitSmallFontSize: number;
    suitBigFontSize: number;
    numberFontSize: number;
    isHidden: boolean = true;

    constructor(public navCtrl: NavController) {
    }

    ngAfterViewChecked() {
        if (this.card) {
            this.adjustCardSize();
        }
    }

    adjustCardSize() {
        let sizeRatio = 1.4;
        let $container = $(this.cardContainer.nativeElement);
        let $cardView = $(this.cardView.nativeElement);
        let width = $container.width()
        let height = $container.height();

        if (height < width * sizeRatio) {
            $cardView.width(height / sizeRatio);
            $cardView.height(height);
        } else {
            $cardView.height(width * sizeRatio);
            $cardView.width(width);
        }

        $cardView.css('border-radius', `${$cardView.width() * 0.025}px`);

        this.suitBigFontSize = Math.round($cardView.width() * 0.4);
        this.suitSmallFontSize = Math.round($cardView.width() * 0.12);
        this.numberFontSize = Math.round($cardView.width() * 0.2);
    }

    setCard(card: Card) {
        if (card) {
            this.card = card;
            this.isHidden = false;
        } else {
            this.card = card;
            this.isHidden = true;
        }
    }
}
