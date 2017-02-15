/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';
import {NavParams} from "ionic-angular";

@Component({
  selector: 'page-event-team',
  templateUrl: 'event-team.html'
})
export class EventTeamPage {

  event: any;
  team: any;

  constructor(private navParams: NavParams) {

    if (this.navParams.get("event")) {
      this.event = this.navParams.get("event");
    } else {
      this.event = null;
    }

    if (this.navParams.get("team")) {
      this.team = this.navParams.get("team");
    } else {
      this.team = null;
    }

  }

}
