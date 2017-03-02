import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { ViewController } from 'ionic-angular';
import { SettingsService } from './settings.service';
import { HomePage } from '../home/home';

@Component({
    selector: 'settings',
    templateUrl: 'settings.component.html'
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
