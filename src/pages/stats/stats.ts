import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, NavController } from 'ionic-angular';
import { TBAService } from '../../providers/tba-service'
import { TeamInfoPage } from '../team-info/team-info';
import { TeamAwardsPage } from "../team-awards/team-awards";
import { TeamRobotsPage } from "../team-robots/team-robots";
import { TeamEventsPage } from "../team-events/team-events";
import { EventsSorter } from "../../util/sorting";
import { EventFilter } from '../../util/filter';
import { Keyboard } from 'ionic-native';
import {Config} from "../../util/config";
import {EventPage} from "../event/event";

declare var cordova: any;

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
  providers: [TBAService]
})
export class StatsPage {

  eventsSorter: EventsSorter;
  eventFilter: EventFilter;

  @ViewChild(Content) content: Content;

  /* AJAX Request Variables */
  openRequests: any;
  requestID: number;
  load: any;
  requestOpen: boolean;

  /* AJAX data holding variables  */
  public events: any;
  public sorted_events: any;
  public team: any;
  public my_comp: any;

  /* My Event Variables  */
  districts: any;
  myEvents: any;
  my_comp_key: any;

  /* Global Data binding */
  viewType: string;
  viewID: number;

  /* Teams Data bindings */
  teamNumber: number;

  /* Events Data bindings */
  eventYear: number;

  /* My Event Data bindings */
  myDistrict: string;

  /* Page initialized booleans */
  initialized: boolean;

  /* Dummy Array */
  dummy: any;

  loading: boolean;

  constructor(private tba: TBAService, private navCtrl: NavController, private alertCtrl: AlertController) {
    this.eventsSorter = new EventsSorter();

    this.openRequests = 0;
    this.requestID = 0;
    this.viewType = 'team';
    this.viewID = 0;
    this.requestOpen = false;
    this.teamNumber = 254;
    this.eventYear = 2017;
    this.initialized = false;
    this.loading = false;

    //

    if (!Config.IS_BROWSER) {
      window.addEventListener('native.keyboardshow', () => {
        document.body.classList.add("keyboard-is-open");
      });

      window.addEventListener('native.keyboardhide', () => {
        document.body.classList.remove("keyboard-is-open");
      });
    }

    // We fill a dummy array to have default values to resort to when our data variables are uninitialized/undefined.
    this.dummy = [
      {
        "dummy": 1
      }
    ];

    this.districts = [
      {
        "name": "Chesapeake",
        "key": "chs"
      },
      {
        "name": "Georgia",
        "key": "pch"
      },
      {
        "name": "Indiana",
        "key": "in"
      },
      {
        "name": "Israel",
        "key": "isr"
      },
      {
        "name": "Michigan",
        "key": "fim"
      },
      {
        "name": "Mid Atlantic",
        "key": "mar"
      },
      {
        "name": "North Carolina",
        "key": "nc"
      },
      {
        "name": "New England",
        "key": "ne"
      },
      {
        "name": "Ontario",
        "key": "ont"
      },
      {
        "name": "Pacific Northwest",
        "key": "pnw"
      }
    ];

  }

  clearEvents() {
    this.events = null;
    this.sorted_events = null;
    this.eventFilter = null;
  }

  openEventPage(key) {
    this.navCtrl.push(EventPage, {
      event_key: key
    });
  }

  openInfoPage() {
    if (this.team) {
      this.navCtrl.push(TeamInfoPage, {
        team: this.team
      });
    }
  }

  openAwardsPage() {
    if (this.team) {
      this.navCtrl.push(TeamAwardsPage, {
        team: this.team,
        awards: this.team.awards
      });
    }
  }

  openRobotsPage() {
    if (this.team) {
      this.navCtrl.push(TeamRobotsPage, {
        team: this.team,
        robots: this.team.robots
      });
    }
  }

  openEventsPage() {
    if (this.team) {
      this.navCtrl.push(TeamEventsPage, {
        team: this.team,
        events: this.team.events
      });
    }
  }

  checkScroll(e) {
    let scroll = document.getElementsByClassName("scroll")[1];
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

  bindListeners() {

    let loading = document.getElementById("loading-1") || document.getElementById("loading-2");

    loading.addEventListener("transitionend", () => {
      if (loading.classList.contains("visible")) {
        // hide
      } else {
        // show
        console.log("Making loader hidden");
        loading.setAttribute("style", "display: none");
        if (this.viewType == "team") {
          if (this.team) {
            this.showCards();
          } else {
            this.hideCards();
          }
        }
      }
    });

  }

  checkIfDataCached() {
    if (this.viewType == "event") {

    }
    if (this.viewType == "team") {
      if (this.team) {

        /* This is the only way to show the cards again after switching views.
         * The DOM does not become instantly available, so we must wait 250ms
         * (approximation) before the DOM becomes ready again.*/
        setTimeout(() => {
          this.showCards();
        }, 125);
      }
    }
  }

  cacheEvent() {
    console.log("Caching soon!");
  }

  showAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  showLoading() {
    if (!this.initialized) {
      this.bindListeners();
    }

    let loading = document.getElementById("loading-1") || document.getElementById("loading-2");
    loading.style.display = "block";
    console.log(loading);
    loading.classList.remove("hidden");
    loading.classList.add("visible");
  }

  hideLoading() {
    let loading = document.getElementById("loading-1") || document.getElementById("loading-2");
    loading.classList.remove("visible");
    loading.classList.add("hidden");
  }

  showCards() {
    if (this.viewType == "team") {
      let panel1 = document.getElementById("teams-number");
      let panel2 = document.getElementById("teams-cards");
      panel1.classList.remove("hidden");
      panel2.classList.remove("hidden");
      panel1.classList.add("visible");
      panel2.classList.add("visible");
    }
    if (this.viewType == "my_comp") {
      let panel = document.getElementById("event-cards");
      panel.classList.remove("hidden");
      panel.classList.add("visible");
    }
  }

  hideCards() {
    if (this.viewType == "team") {
      let panel1 = document.getElementById("teams-number");
      let panel2 = document.getElementById("teams-cards");
      panel1.classList.remove("visible");
      panel2.classList.remove("visible");
      panel1.classList.add("hidden");
      panel2.classList.add("hidden");
    }
    if (this.viewType == "my_comp") {
      let panel = document.getElementById("event-cards");
      panel.classList.remove("visible");
      panel.classList.add("hidden");
    }
  }

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

  getEvents(year) {
    if (!this.requestOpen) {
      this.viewID = 1;
      // this.hideCards();
      this.requestOpen = true;
      this.showLoading();
      this.tba.requestEventList(year)
        .subscribe(
          data => {
            this.requestOpen = false;
            this.events = data;
            this.sorted_events = this.eventsSorter.quicksort(this.events, 0, this.events.length - 1);
            if (!this.eventFilter) {
              this.eventFilter = new EventFilter(this.sorted_events);
            } else {
              this.eventFilter.setEvents(this.sorted_events);
            }
            this.hideLoading();
          },
          err => {
            this.requestOpen = false;
            this.events = null;
            this.sorted_events = null;
            this.eventFilter = null;
            this.hideLoading();
            this.showAlert("Error", "Did not find any events by that year.");
          }
        );
    }
  }

  getTeamInfo(team) {
    if (!this.requestOpen) {
      this.viewID = 2;
      this.hideCards();
      this.requestOpen = true;
      this.showLoading();
      this.tba.requestCompleteTeamInfo(team)
        .subscribe(
          data => {
            this.requestOpen = false;
            this.team = data[0];
            this.team.years = data[1].length;
            this.team.robots = data[2];
            this.team.events = data[3];
            this.team.awards = data[4];

            this.hideLoading();
          },
          err => {
            this.requestOpen = false;
            this.team = null;
            this.hideLoading();
            this.showAlert("Error", "Did not find any team matching that number.");
          }
        );
    }
  }

}
