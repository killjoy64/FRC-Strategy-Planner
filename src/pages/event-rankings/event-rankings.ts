import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';

@Component({
  selector: 'page-event-rankings',
  templateUrl: 'event-rankings.html'
})
export class EventRankingsPage {

  @ViewChild(Content) content: Content;

  event: any;
  rankings: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.event = navParams.get("event");
    this.rankings = [];
    this.repopulateArray();
  }

  repopulateArray() {
    for (let i = 1; i < this.event.ranks.length; i++) {
      let ranking = this.event.ranks[i];
      let rank = ranking[0];
      let team = ranking[1];

      this.rankings.push({
        "team": team,
        "rank": rank
      });
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
