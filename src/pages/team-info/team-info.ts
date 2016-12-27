import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-team-info',
  templateUrl: 'team-info.html'
})
export class TeamInfoPage {

  team: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.team = navParams.get("team");
  }

}
