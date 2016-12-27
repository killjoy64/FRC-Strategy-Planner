import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';

@Component({
  selector: 'page-team-events',
  templateUrl: 'team-events.html'
})
export class TeamEventsPage {

  @ViewChild(Content) content: Content;

  team: any;
  events: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.team = navParams.get("team");
    this.events = navParams.get("events");
  }

  ngAfterViewInit() {
    this.content.addScrollListener((e) => {
      if (e.target.scrollTop >= 150) {
        if (document.getElementById("scroll-top-events").classList.contains("hidden")) {
          document.getElementById("scroll-top-events").classList.remove("hidden");
          document.getElementById("scroll-top-events").classList.add("visible");
        }
      } else {
        if (document.getElementById("scroll-top-events").classList.contains("visible")) {
          document.getElementById("scroll-top-events").classList.remove("visible");
          document.getElementById("scroll-top-events").classList.add("hidden");
        }
      }
    });
  }

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

}
