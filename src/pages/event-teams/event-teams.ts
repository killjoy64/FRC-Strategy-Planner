import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {EventTeamPage} from "../event-team/event-team";

@Component({
  selector: 'page-event-teams',
  templateUrl: 'event-teams.html'
})
export class EventTeamsPage {

  event: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.event = navParams.get("event");
  }

  openTeamPage(team) {
    this.navCtrl.push(EventTeamPage, {
      event: this.event,
      team: team
    });
  }

}
