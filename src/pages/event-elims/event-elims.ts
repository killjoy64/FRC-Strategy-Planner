import {Component, ViewChild} from '@angular/core';
import {NavParams, Content} from 'ionic-angular';
import {TeamSorter} from "../../util/sorting";


@Component({
  selector: 'page-event-elims',
  templateUrl: 'event-elims.html'
})
export class EventElimsPage {

  @ViewChild(Content) content: Content;

  teamSorter: TeamSorter;

  event: any;
  teams: any;

  constructor(private navParams: NavParams) {
    this.teamSorter = new TeamSorter();
    this.event = navParams.get("event");
    this.teams = this.teamSorter.quicksort(this.event.teams, 0, this.event.teams.length - 1);
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

  selectTeam(team, e) {
    console.log(team);
    let robots = document.getElementsByClassName("team-elim");
    for (let i = 0; i < robots.length; i++) {
      robots[i].classList.remove("selected");
    }
    e.target.classList.add("selected");
  }

}
