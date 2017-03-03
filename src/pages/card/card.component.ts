import { Component, ViewChild, ElementRef, AfterViewChecked, trigger, state, style, transition, animate } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Card } from './card';

import * as $ from 'jquery';

@Component({
    selector: 'card',
    template: `<div #cardContainer (window:resize)="adjustCardSize($event)" class="card-container" [class.hidden]="isHidden" [@flyOut]="state">
        <div #cardView class="card-view center {{card.currentColor}}">
            <div class="card-num-suit-segment">
                <div class="number" [style.font-size.px]="numberFontSize">{{card.symbol}}</div>
                <ion-icon name="{{card.currentSuit}}" class="icon-custom" [style.font-size.px]="suitSmallFontSize"></ion-icon>
            </div>
            <div class="suit-big-wrapper">
                <ion-icon name="{{card.currentSuit}}" class="icon-custom suit-big" [style.font-size.px]="suitBigFontSize"></ion-icon>
            </div>
            <div class="card-num-suit-segment flipped">
                <div class="number" [style.font-size.px]="numberFontSize">{{card.symbol}}</div>
                <ion-icon name="{{card.currentSuit}}" class="icon-custom" [style.font-size.px]="suitSmallFontSize"></ion-icon>
            </div>
        </div>
    </div>`,

    //templateUrl: 'card.component.html',
    animations: [
        trigger('flyOut', [
            state('in', style({transform: 'translateX(0)'})),
            state('out', style({transform: 'translateX(100%)'})),
            transition('in => out', animate('380ms ease-in'))
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
            $container.css('top', `-${height}px`);
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
}
