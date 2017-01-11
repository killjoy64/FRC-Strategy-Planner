import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';
import {EventsSorter} from '../../util/sorting';
import {EventFilter} from '../../util/filter';
import {Config} from '../../util/config';
import { Keyboard } from 'ionic-native';
import {EventPage} from "../event/event";

@Component({
  selector: 'page-team-events',
  templateUrl: 'team-events.html'
})
export class TeamEventsPage {

  eventsSorter: EventsSorter;
  eventFilter: EventFilter;

  @ViewChild(Content) content: Content;

  team: any;
  events: any;
  sorted_events: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.eventsSorter = new EventsSorter();
    this.team = navParams.get("team");
    this.events = navParams.get("events");
    this.sorted_events = this.eventsSorter.quicksort(this.events, 0, this.events.length - 1);
    this.eventFilter = new EventFilter(this.sorted_events);

    if (!Config.IS_BROWSER) {
      window.addEventListener('native.keyboardshow', () => {
        document.body.classList.add("keyboard-is-open");
      });

      window.addEventListener('native.keyboardhide', () => {
        document.body.classList.remove("keyboard-is-open");
      });
    }
  }

  openEventPage(key) {
    this.navCtrl.push(EventPage, {
      event_key: key
    });
  }

  checkScroll(e) {
    let scroll = document.getElementById("scroll");
    if (e.scrollTop >= 150) {
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
  }

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

}
