import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-team-robots',
  templateUrl: 'team-robots.html'
})
export class TeamRobotsPage {

  team: any;
  robots: any;
  temp: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.team = navParams.get("team");
    this.temp = navParams.get("robots");
    this.robots = [];
    this.repopulateArray();
  }

  repopulateArray() {
    let i = 0;
    for (let robot in this.temp) {
      this.robots[i] = {
        "name": this.temp[robot].name,
        "year": this.temp[robot].year
      }
      console.log(robot);
      i++;
    }

    console.log("Repopulated array: " + this.robots);

  }

}
