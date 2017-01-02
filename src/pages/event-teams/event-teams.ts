import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';
import { EventTeamPage } from "../event-team/event-team";
import { TeamSorter } from '../../util/sorting';
import { TeamFilter } from '../../util/filter';

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

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.teamSorter = new TeamSorter();
    this.event = navParams.get("event");
    this.teams = this.teamSorter.quicksort(this.event.teams, 0, this.event.teams.length - 1);
    this.teamFilter = new TeamFilter(this.teams);
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

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

}
