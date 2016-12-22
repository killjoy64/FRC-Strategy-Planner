import { Component, ViewChild } from '@angular/core';
import { AlertController, Content } from 'ionic-angular';
import { TBAService } from '../../providers/tba-service'

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

  /* Data bindings */
  viewType: string;
  teamNumber: number;

  /* Page initialized booleans */
  initialized: boolean;

  /* Dummy Array */
  dummy: any;

  constructor(private tba: TBAService, private alertCtrl: AlertController) {
    this.openRequests = 0;
    this.requestID = 0;
    this.viewType = 'my_comp';
    this.requestOpen = false;
    this.teamNumber = 254;
    this.initialized = false;

    // We fill a dummy array to have default values to resort to when our data variables are uninitialized/undefined.
    this.dummy = [
      {
        "dummy": 1
      }
    ];
  }

  ngAfterViewInit() {
    this.content.addScrollListener((e) => {
      if (e.target.scrollTop >= 150) {
        if (document.getElementById("scroll-top").classList.contains("hidden")) {
          document.getElementById("scroll-top").classList.remove("hidden");
          document.getElementById("scroll-top").classList.add("visible");
        }
      } else {
        if (document.getElementById("scroll-top").classList.contains("visible")) {
          document.getElementById("scroll-top").classList.remove("visible");
          document.getElementById("scroll-top").classList.add("hidden");
        }
      }
    });
  }

  scrollToTop() {
    this.content.scrollToTop(800);
  }

  bindListeners() {
    document.getElementById("loading").addEventListener("transitionend", () => {
      if (document.getElementById("loading").classList.contains("visible")) {
        // hide
      } else {
        // show
        document.getElementById("loading").style.display = "none";
      }
    });
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

    let loading = document.getElementById("loading");
    loading.style.display = "block";
    loading.classList.remove("hidden");
    loading.classList.add("visible");
  }

  hideLoading() {
    let loading = document.getElementById("loading");
    loading.classList.remove("visible");
    loading.classList.add("hidden");
  }

  testLoad() {
    this.showLoading();
    setTimeout(() => {
      this.hideLoading();
    }, 2000);
  }

  getTeamInfo(team) {
    if (!this.requestOpen) {
      this.requestOpen = true;
      this.showLoading();
      this.tba.requestCompleteTeamInfo(team)
        .subscribe(
          data => {
            this.requestOpen = false;
            this.team = data[0];
            this.team.years = data[0].length;
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
