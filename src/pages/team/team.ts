/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-team',
  templateUrl: 'team.html'
})
export class TeamPage {

  team: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    if (this.navParams.get("team")) {
      this.team = this.navParams.get("team");
    } else {
      this.team = null;
    }
    console.log(this.team);
  }

}
