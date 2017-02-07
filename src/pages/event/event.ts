/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html'
})
export class EventPage {

  year: any;
  district: any;
  key: any;

  events: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.year = navParams.get("year");
    this.district = navParams.get("district");
    this.key = navParams.get("key");
    this.events = navParams.get("events");

    console.log(this.events);
  }

}
