import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, NavController } from 'ionic-angular';
import { TBAService } from '../../providers/tba-service'

@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
  providers: [TBAService]
})
export class NotesPage {

  @ViewChild(Content) content: Content;

  /* AJAX Request Variables */
  openRequests: any;
  requestID: number;
  load: any;
  requestOpen: boolean;

  /* AJAX data holding variables  */
  public events: any;
  public my_comp: any;

  /* My Event Variables  */
  districts: any;
  myEvents: any;
  my_comp_key: any;

  /* Events Data bindings */
  eventYear: number;

  /* My Event Data bindings */
  myDistrict: string;

  /* Page initialized booleans */
  initialized: boolean;
  loading: boolean;

  constructor(private tba: TBAService, private navCtrl: NavController, private alertCtrl: AlertController) {
    this.openRequests = 0;
    this.requestID = 0;
    this.requestOpen = false;
    this.eventYear = 2017;
    this.initialized = false;
    this.loading = false;

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

  ionViewDidEnter() {
    if (this.my_comp) {
      this.showCards();
    }
  }

  bindListeners() {

    let loadings = document.getElementsByClassName("loading");

    loadings[0].addEventListener("transitionend", () => {
      if (document.getElementsByClassName("loading")[0].classList.contains("visible")) {
        // hide
      } else {
        // show
        console.log("Making loader hidden");
        document.getElementsByClassName("loading")[0].setAttribute("style", "display: none");
        this.loading = false;
        if (this.my_comp) {
          this.showCards();
        } else {
          this.hideCards();
        }
      }
    });

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
    let panel = document.getElementById("event-cards");
    panel.classList.remove("hidden");
    panel.classList.add("visible");
  }

  hideCards() {
    let panel = document.getElementById("event-cards");
    panel.classList.remove("visible");
    panel.classList.add("hidden");
  }

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

  resetMyEvent() {
    this.confirmClear();
  }

  updateEvents() {
    if (!this.requestOpen && this.myDistrict) {
      this.loading = true;
      this.requestOpen = true;
      this.showLoading();
      this.tba.requestDistrictEvents(this.eventYear, this.myDistrict)
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

}
