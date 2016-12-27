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

  /* Global Data binding */
  viewType: string;
  viewID: number;

  /* Teams Data bindings */
  teamNumber: number;

  /* Events Data bindings */
  eventYear: number;

  /* Page initialized booleans */
  initialized: boolean;

  /* Dummy Array */
  dummy: any;

  constructor(private tba: TBAService, private navCtrl: NavController, private alertCtrl: AlertController) {
    this.openRequests = 0;
    this.requestID = 0;
    this.viewType = 'my_comp';
    this.viewID = 0;
    this.requestOpen = false;
    this.teamNumber = 254;
    this.eventYear = 2017;
    this.initialized = false;


    // We fill a dummy array to have default values to resort to when our data variables are uninitialized/undefined.
    this.dummy = [
      {
        "dummy": 1
      }
    ];
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

    console.log("Load symbols found: " + loadings.length);

    for (let i = 0; i < loadings.length; i++) {
      loadings[i].addEventListener("transitionend", () => {
        if (document.getElementsByClassName("loading")[i].classList.contains("visible")) {
          // hide
        } else {
          // show
          document.getElementsByClassName("loading")[i].setAttribute("style", "display: none");
          console.log("Current view: " + this.viewType);
          if (this.viewType == "team") {
            if (this.team) {
              this.showCards();
            } else {
              this.hideCards();
            }
          } else {
            // do stuff
          }
        }
      });
    }

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
    let panel1 = document.getElementById("teams-number");
    let panel2 = document.getElementById("teams-cards");
    panel1.classList.remove("hidden");
    panel2.classList.remove("hidden");
    panel1.classList.add("visible");
    panel2.classList.add("visible");
  }

  hideCards() {
    let panel1 = document.getElementById("teams-number");
    let panel2 = document.getElementById("teams-cards");
    panel1.classList.remove("visible");
    panel2.classList.remove("visible");
    panel1.classList.add("hidden");
    panel2.classList.add("hidden");
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
