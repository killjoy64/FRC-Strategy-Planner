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

  last_view: string;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.last_view = null;

    if (this.navParams.get("team")) {
      this.team = this.navParams.get("team");
    } else {
      this.team = null;
    }
  }

  ionViewWillEnter() {
    this.showAbout();
  }

  showAbout() {
    if (this.canToggleView("about-btn")) {
      this.toggleView("about-content");
    }
  }

  showPitInfo() {
    if (this.canToggleView("pit-btn")) {

    }
  }

  showAwards() {
    if (this.canToggleView("awards-btn")) {

    }
  }

  showEvents() {
    if (this.canToggleView("events-btn")) {
      this.toggleView("events-content");
    }
  }

  private toggleView(id) {
    console.log(this.last_view);
    if (this.last_view) {
      Style.fadeOutOp(this.last_view).then(() => {
        document.getElementById(this.last_view).style.display = "none";
        this.showView(id);
      });
    }
  }

  private showView(id) {
    document.getElementById(id).style.display = "block";
    this.last_view = id;
    Style.fadeInOp(id);
  }

  private clearActiveButtons() {
    let buttons = document.getElementsByClassName("profile-button");

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active-button");
    }
  }

  private canToggleView(id) {
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
