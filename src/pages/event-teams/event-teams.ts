import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventTeamPage } from "../event-team/event-team";
import { TeamSorter } from '../../util/sorting';
import { TeamFilter } from '../../util/filter';

@Component({
  selector: 'page-event-teams',
  templateUrl: 'event-teams.html'
})
export class EventTeamsPage {

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

}
