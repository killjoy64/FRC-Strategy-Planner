/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Style } from "../../util/style";

@Component({
  selector: 'page-teams-events',
  templateUrl: 'tab-teams-events.html'
})
export class TeamsAndEventsPage {

  show_teams: boolean;
  show_events: boolean;

  constructor(public navCtrl: NavController) {
    this.show_teams = false;
    this.show_events = false;
  }

  showTeams() {
    document.getElementById("teams_search").style.display = "block";
    Style.translateY("events", 100).then(() => {
      Style.fadeInOp("teams_search");
    });
  }

  showEvents() {
    document.getElementById("events_search").style.display = "block";
    Style.translateY("teams", -100).then(() => {
      Style.fadeInOp("events_search");
    });
  }

  resetTeamView() {
    Style.fadeOutOp("events_search").then(() => {
      document.getElementById("events_search").style.display = "none";
    });
    Style.translateY("teams", 0);
  }

  resetEventView() {
    Style.fadeOutOp("teams_search").then(() => {
      document.getElementById("teams_search").style.display = "none";
    });
    Style.translateY("events", 0);
  }

}
