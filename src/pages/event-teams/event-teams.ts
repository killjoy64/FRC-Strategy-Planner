import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';
import { EventTeamPage } from "../event-team/event-team";
import { TeamSorter } from '../../util/sorting';
import { TeamFilter } from '../../util/filter';
import {DomSanitizer} from '@angular/platform-browser';
import {Config} from "../../util/config";

@Component({
  selector: 'page-event-teams',
  templateUrl: 'event-teams.html'
})
export class EventTeamsPage {

  @ViewChild(Content) content: Content;

  teamSorter: TeamSorter;
  teamFilter: TeamFilter;

  event: any;
  teams: any;

  initialized: boolean;

  constructor(private navCtrl: NavController, private navParams: NavParams, public sanitizer: DomSanitizer) {
    this.teamSorter = new TeamSorter();
    this.event = navParams.get("event");
    this.teams = this.teamSorter.quicksort(this.event.teams, 0, this.event.teams.length - 1);
    this.teamFilter = new TeamFilter(this.teams);

    if (!Config.IS_BROWSER) {
      window.addEventListener('native.keyboardshow', () => {
        document.body.classList.add("keyboard-is-open");
      });

      window.addEventListener('native.keyboardhide', () => {
        document.body.classList.remove("keyboard-is-open");
      });
    }

    this.initialized = false;
  }

  openTeamPage(team) {
    this.navCtrl.push(EventTeamPage, {
      event: this.event,
      team: team
    });
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

  ionViewDidEnter() {
    if (!this.initialized) {
      let list = document.getElementById("team-list");
      let items = list.getElementsByClassName("item");
      let height = items[0].clientHeight;
      list.setAttribute("approxItemHeight", height + "px");
    }
  }

  scrollToTop() {
    this.content.scrollToTop(2000);
  }

}
