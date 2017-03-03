import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
    selector: 'settings',
    template: `<div class="settings-container">
        <div class="item-group">
            <div class="item-title">
                decks
            </div>
            <div class="item">
                <ion-range [(ngModel)]="homePage.numDecks" min="1" max="8" step="1" snaps="true" color="accent"></ion-range>
                <ion-badge color="accent" item-right>{{homePage.numDecks}}</ion-badge>
            </div>
        </div>
        <div class="item-group">
            <div class="item-title">
                cards per second
            </div>
            <div class="item">
                <ion-range [(ngModel)]="homePage.dealingSpeed" min="30" max="150" color="accent" disabled="{{homePage.isDealing}}"></ion-range>
                <ion-badge color="accent" item-right>{{homePage.dealingSpeed}}</ion-badge>
            </div>
        </div>
    </div>`
    //templateUrl: 'settings.component.html'
})
export class SettingsComponent implements OnInit {

    homePage: HomePage;

    constructor(public navParams: NavParams) {
    }

    ngOnInit() {
        if (this.navParams.data) {
            this.homePage = this.navParams.data.homePage;
        }
    }
}
