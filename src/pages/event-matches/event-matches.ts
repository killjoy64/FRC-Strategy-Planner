import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';
import { MatchSorter } from '../../util/sorting';
import { MatchConverter } from '../../util/string-converter';
import { MatchFilter } from '../../util/filter';
import {Config} from "../../util/config";

@Component({
  selector: 'page-event-matches',
  templateUrl: 'event-matches.html'
})
export class EventMatchesPage {

  matchSorter: MatchSorter;
  matchConverter: MatchConverter;
  matchFilter: MatchFilter;

  @ViewChild(Content) content: Content;

  event: any;
  matches: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.matchSorter = new MatchSorter();
    this.matchConverter = new MatchConverter();
    this.event = navParams.get("event");
    this.matches = this.matchSorter.quicksort(this.event.matches, 0, this.event.matches.length - 1);
    this.matchFilter = new MatchFilter(this.matches);

    if (!Config.IS_BROWSER) {
      window.addEventListener('native.keyboardshow', () => {
        document.body.classList.add("keyboard-is-open");
      });

      window.addEventListener('native.keyboardhide', () => {
        document.body.classList.remove("keyboard-is-open");
      });
    }
  }

  checkScroll(e) {
    let scroll = document.getElementById("scroll");
    if (e.scrollTop >= 150) {
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
  }

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

}
