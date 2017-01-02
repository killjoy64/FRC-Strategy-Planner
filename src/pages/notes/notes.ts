import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, NavController } from 'ionic-angular';
import { TBAService } from '../../providers/tba-service'
import {EventTeamsPage} from "../event-teams/event-teams";
import {EventMatchesPage} from "../event-matches/event-matches";
import {EventRankingsPage} from "../event-rankings/event-rankings";
import {EventAwardsPage} from "../event-awards/event-awards";
import {AppDirectory, TeamAvatar} from '../../util/file-reader';
import {Entry} from "ionic-native";
import {Config} from "../../util/config";

@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
  providers: [TBAService]
})
export class NotesPage {

  @ViewChild(Content) content: Content;

  teamAvatar: TeamAvatar;

  /* AJAX Request Variables */
  openRequests: any;
  requestID: number;
  load: any;
  requestOpen: boolean;

  /* AJAX data holding variables  */
  public static CURRENT_EVENT;
  public my_comp: any;
  public events: any;

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
    this.eventYear = 2016;
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

    this.teamAvatar = new TeamAvatar();

  }

  openEventTeamsPage() {
    if (this.my_comp) {
      this.navCtrl.push(EventTeamsPage, {
        event: this.my_comp
      });
    }
  }

  openEventMatchesPage() {
    if (this.my_comp) {
      this.navCtrl.push(EventMatchesPage, {
        event: this.my_comp
      });
    }
  }

  openEventRankingsPage() {
    if (this.my_comp) {
      this.navCtrl.push(EventRankingsPage, {
        event: this.my_comp
      });
    }
  }

  openEventAwardsPage() {
    if (this.my_comp) {
      this.navCtrl.push(EventAwardsPage, {
        event: this.my_comp
      });
    }
  }

  clearEvents() {
    this.my_comp = null;
    console.log(this.my_comp);
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

    let loading = document.getElementById("loading");

    loading.addEventListener("transitionend", () => {
      if (loading.classList.contains("visible")) {
        // hide
      } else {
        // show
        console.log("Making loader hidden");
        loading.style.display = "none";
        this.loading = false;
        if (this.my_comp && this.my_comp != null) {
          this.showCards();
        } else {
          console.log("HIDING CARDS");
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
            self.hideCards();
            self.my_comp = null;
            NotesPage.CURRENT_EVENT = null;
            console.log(self.my_comp);
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
    this.loading = true;

    if (!this.initialized) {
      this.bindListeners();
    }

    let loading = document.getElementById("loading");
    loading.setAttribute("style", "display: block");
    loading.classList.remove("hidden");
    loading.classList.add("visible");
  }

  hideLoading() {
    this.loading = false;
    let loading = document.getElementById("loading");
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
            this.my_comp.awards = data[5];
            this.my_comp.points = data[6];
            NotesPage.CURRENT_EVENT = this.my_comp;
            if (!Config.IS_BROWSER) {
              this.teamAvatar.getAvatars().then((data:Entry[]) => {

                for (let i = 0; i < this.my_comp.teams.length; i++) {
                  let team_number:string = this.my_comp.teams[i].team_number;
                  for (let j = 0; j < data.length; j++) {
                    let length = data[j].name.length;
                    let name = data[j].name.substring(0, length-4);
                    if (team_number == name) {
                      this.my_comp.teams[i].avatar_url = AppDirectory.getPermDir() + "avatars/" + team_number + ".jpg";
                      break;
                    }
                  }
                }

                this.hideLoading();
              }, err => {
                console.log("Error!");
              });
            } else {
              this.hideLoading();
            }
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
