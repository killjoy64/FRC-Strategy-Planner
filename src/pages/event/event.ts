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

  event: any;

  view: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {

    this.view = null;

    if (this.navParams.get("event")) {
      this.event = this.navParams.get("event");
    } else {
      this.event = null;
    }

  }

  showAbout() {
    this.toggleButton("ranks-btn");
    this.view = 'about';
  }

  showPitInfo() {
    this.toggleButton("teams-btn");
    this.view = 'pit';
  }

  showAwards() {
    this.toggleButton("award-btn");
    this.view = 'awards';
  }

  showEvents() {
    this.toggleButton("matches-btn");
    this.view = 'events';
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
