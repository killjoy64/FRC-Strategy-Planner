import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';

@Component({
  selector: 'page-event-team',
  templateUrl: 'event-team.html'
})
export class EventTeamPage {

  @ViewChild(Content) content: Content;

  team: any;
  event: any;
  matches: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.team = navParams.get("team");
    this.event = navParams.get("event");
    this.matches = [];

    for (let match of this.event.matches) {
      for (let i = 0; i < 3; i++) {
        if (match.alliances.blue.teams[i] == this.team.key) {
          this.matches.push(match);
        }
        if (match.alliances.red.teams[i] == this.team.key) {
          this.matches.push(match);
        }
      }
    }

  }

  ngAfterViewInit() {
    this.content.addScrollListener((e) => {
      let scroll = document.getElementById("scroll");
      if (e.target.scrollTop >= 150) {
        if (scroll.classList.contains("hidden")) {
          scroll.classList.remove("hidden");
          scroll.classList.add("visible");
        }
      } else {
        if (scroll.classList.contains("visible")) {
          scroll.classList.remove("visible");
          scroll.classList.add("hidden");
        }
      }
    });
  }

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

}
