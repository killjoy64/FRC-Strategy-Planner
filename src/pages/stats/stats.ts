import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, NavController } from 'ionic-angular';
import { TBAService } from '../../providers/tba-service'
import { TeamInfoPage } from '../team-info/team-info';
import { TeamAwardsPage } from "../team-awards/team-awards";
import {TeamRobotsPage} from "../team-robots/team-robots";
import {TeamEventsPage} from "../team-events/team-events";

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
  providers: [TBAService]
})
export class StatsPage {

  @ViewChild(Content) content: Content;

  /* AJAX Request Variables */
  openRequests: any;
  requestID: number;
  load: any;
  requestOpen: boolean;

  /* AJAX data holding variables  */
  public events: any;
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

  ngAfterViewInit() {
    this.content.addScrollListener((e) => {
      let scroll = document.getElementsByClassName("scroll")[0];
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

  bindListeners() {

    let loadings = document.getElementsByClassName("loading");

    document.addEventListener("load", () => {
      console.log("TESTING");
    });

    loadings[0].addEventListener("transitionend", () => {
      if (document.getElementsByClassName("loading")[0].classList.contains("visible")) {
        // hide
      } else {
        // show
        console.log("Making loader hidden");
        document.getElementsByClassName("loading")[0].setAttribute("style", "display: none");
        if (this.viewType == "team") {
          if (this.team) {
            this.showCards();
          } else {
            this.hideCards();
          }
        }
        if (this.viewType == "my_comp") {
          this.loading = false;
          if (this.my_comp) {
            this.showCards();
          } else {
            this.hideCards();
          }
        }
      }
    });

  }

  checkIfDataCached() {
    if (this.viewType == "my_comp") {
      if (this.my_comp) {
        setTimeout(() => {
          /* This is the only way to show the cards again after switching views.
           * The DOM does not become instantly available, so we must wait 250ms
           * (approximation) before the DOM becomes ready again.*/
          this.showCards();
        }, 125);
      }
    }
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

  confirmClear() {
    let self = this;
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to clear all of your event information? It may become impossible to recover this data if you are unable to access internet or cellular data at your event.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            self.my_comp = null;
          }
        }
      ]
    });
    alert.present();
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

    let loading = document.getElementsByClassName("loading")[0];
    loading.setAttribute("style", "display: block");
    loading.classList.remove("hidden");
    loading.classList.add("visible");
  }

  hideLoading() {
    let loading = document.getElementsByClassName("loading")[0];
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

  resetMyEvent() {
    this.confirmClear();
  }

  updateEvents() {
    if (!this.requestOpen && this.myDistrict) {
      this.viewID = 0;
      // this.hideCards();
      this.loading = true;
      this.requestOpen = true;
      this.showLoading();
      this.tba.requestDistrictEvents(2016, this.myDistrict)
        .subscribe(
          data => {
            this.requestOpen = false;
            this.loading = false;
            this.myEvents = data;
            this.hideLoading();
          },
          err => {
            this.requestOpen = false;
            this.loading = false;
            this.events = null;
            this.hideLoading();
            this.showAlert("Error", "Did not find any events by that district.");
          }
        );
    }
  }

  getMyEvent(event) {
    if (!this.requestOpen && this.my_comp_key ) {
      this.viewID = 0;
      this.loading = true;
      this.requestOpen = true;
      if (!this.my_comp) {
        this.showLoading();
      }
      this.tba.requestCompleteEventInfo(event)
        .subscribe(
          data => {
            this.requestOpen = false;
            this.loading = false;
            this.my_comp = data[0];
            this.my_comp.teams = data[1];
            this.my_comp.matches = data[2];
            this.my_comp.stats = data[3];
            this.my_comp.ranks = data[4];
            this.my_comp.awards = [5];
            this.my_comp.points = [6];
            this.hideLoading();
          },
          err => {
            this.requestOpen = false;
            this.loading = false;
            this.events = null;
            this.hideLoading();
            this.showAlert("Error", "Did not find any events by that district.");
          }
        );
    }
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
            this.hideLoading();
          },
          err => {
            this.requestOpen = false;
            this.events = null;
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
