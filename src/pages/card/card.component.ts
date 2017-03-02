import { Component, ViewChild, ElementRef, AfterViewChecked, trigger, state, style, transition, animate } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Card } from './card';

import * as $ from 'jquery';

@Component({
    selector: 'card',
    templateUrl: 'card.component.html',
    animations: [
        trigger('flyOut', [
            state('in', style({transform: 'translateX(0)'})),
            state('out', style({transform: 'translateX(100%)'})),
            transition('in => out', animate('300ms ease-in'))
        ])
    ]
})
export class CardComponent implements AfterViewChecked {
    @ViewChild('cardContainer') cardContainer: ElementRef;
    @ViewChild('cardView') cardView: ElementRef;

    private card: Card = new Card(2, 4); // setup mock card to init view
    suitSmallFontSize: number;
    suitBigFontSize: number;
    numberFontSize: number;
    isHidden: boolean = true;
    state: string = 'in';
    isMovable: boolean = false;

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

        if (this.isMovable) {
            $container.css('top', `-${$cardView.height()}px`);
        }
    }

    setCard(card: Card) {
        if (card) {
            this.card = card;
            this.isHidden = false;
        } else {
            this.isHidden = true;
        }
    }

    snapToCard(cardComponent: CardComponent) {
        let position = $(cardComponent.cardView.nativeElement).position();
        $(this.cardView.nativeElement).css({top: position.top, left: position.left});
    }
}
