/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Style } from "../../util/style";

@Component({
  selector: 'page-team',
  templateUrl: 'team.html'
})
export class TeamPage {

  team: any;

  view: string;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.view = null;

    if (this.navParams.get("team")) {
      this.team = this.navParams.get("team");
    } else {
      this.team = null;
    }
  }

  ionViewWillEnter() {
    this.showAbout();

    this.assignAwardEvents();
  }

  showAbout() {
    this.toggleButton("about-btn");
    this.view = 'about';
  }

  showPitInfo() {
    this.toggleButton("pit-btn");
    this.view = 'pit';
  }

  showAwards() {
    this.toggleButton("awards-btn");
    this.view = 'awards';
  }

  showEvents() {
    this.toggleButton("events-btn");
    this.view = 'events';
  }

  private assignAwardEvents() {
    return new Promise((resolve) => {
      for (let i = 0; i < this.team.awards.length; i++) {

        let award_event_key = this.team.awards[i].event_key;

        for (let j = 0; j < this.team.events.length; j++) {
          let event_key = this.team.events[j].key;
          if (award_event_key == event_key) {
            this.team.awards[i].event_name = this.team.events[j].name;
            this.team.awards[i].event_week = this.team.events[j].week;
            this.team.awards[i].event_start_date = this.team.events[j].start_date;
            break;
          }
        }
      }
      resolve();
    });
  }

  private clearActiveButtons() {
    let buttons = document.getElementsByClassName("profile-button");

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active-button");
    }
  }

  private toggleButton(id) {
    let btn = document.getElementById(id);
    if (btn.classList.contains("active-button")) {
      this.clearActiveButtons();
      return false;
    } else {
      this.clearActiveButtons();
      btn.classList.add("active-button");
      return true;
    }
  }

}
