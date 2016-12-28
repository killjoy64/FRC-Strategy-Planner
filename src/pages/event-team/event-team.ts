import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-event-team',
  templateUrl: 'event-team.html'
})
export class EventTeamPage {

  team: any;
  event: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.team = navParams.get("team");
    this.event = navParams.get("event");
  }

}
