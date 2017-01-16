import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';

@Component({
  selector: 'page-team-awards',
  templateUrl: 'team-awards.html'
})
export class TeamAwardsPage {

  @ViewChild(Content) content: Content;

  team: any;
  awards: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.team = navParams.get("team");
    this.awards = navParams.get("awards");
  }

  checkScroll(e) {
    if (e.scrollTop >= 150) {
      if (document.getElementById("scroll-top-awards").classList.contains("hidden")) {
        document.getElementById("scroll-top-awards").classList.remove("hidden");
        document.getElementById("scroll-top-awards").classList.add("visible");
      }
    } else {
      if (document.getElementById("scroll-top-awards").classList.contains("visible")) {
        document.getElementById("scroll-top-awards").classList.remove("visible");
        document.getElementById("scroll-top-awards").classList.add("hidden");
      }
    }
  }

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

}
