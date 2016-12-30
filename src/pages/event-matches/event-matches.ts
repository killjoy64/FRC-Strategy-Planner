import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';
import { MatchSorter } from '../../util/sorting';
import { MatchConverter } from '../../util/string-converter';

@Component({
  selector: 'page-event-matches',
  templateUrl: 'event-matches.html'
})
export class EventMatchesPage {

  matchSorter: MatchSorter;
  matchConverter: MatchConverter;

  @ViewChild(Content) content: Content;

  event: any;
  matches: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.matchSorter = new MatchSorter();
    this.matchConverter = new MatchConverter();
    this.event = navParams.get("event");
    this.matches = this.matchSorter.quicksort(this.event.matches, 0, this.event.matches.length - 1);
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
