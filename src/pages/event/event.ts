import { Component } from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import { TBAService } from "../../providers/tba-service";
import {Config} from "../../util/config";
import {Entry} from "ionic-native";
import {TeamAvatar, AppDirectory} from "../../util/file-reader";
import {EventTeamsPage} from "../event-teams/event-teams";
import {EventMatchesPage} from "../event-matches/event-matches";
import {EventRankingsPage} from "../event-rankings/event-rankings";
import {EventAwardsPage} from "../event-awards/event-awards";
import {EventElimsPage} from "../event-elims/event-elims";

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
  providers: [TBAService]
})
export class EventPage {

  event_key;
  my_comp;

  teamAvatar: TeamAvatar;

  loading: boolean;

  constructor(public navCtrl: NavController, private navParams: NavParams, private tba: TBAService, private loadCtrl: LoadingController) {
    this.event_key = navParams.get("event_key");
    this.my_comp = null;
    if (!Config.IS_BROWSER) {
      this.teamAvatar = new TeamAvatar();
    }
  }

  ionViewDidEnter() {
    this.bindListeners();
    if (!this.my_comp) {
      this.getMyEvent(this.event_key);
    }
  }

  bindListeners() {

    let loading = document.getElementById("loading-event");

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

  showCards() {
    let panel = document.getElementById("cards");
    panel.classList.remove("hidden");
    panel.classList.add("visible");
  }

  hideCards() {
    let panel = document.getElementById("cards");
    panel.classList.remove("visible");
    panel.classList.add("hidden");
  }

  showLoading() {
    this.loading = true;
    let loading = document.getElementById("loading-event");
    console.log(loading);
    loading.setAttribute("style", "display: block");
    loading.classList.remove("hidden");
    loading.classList.add("visible");
  }

  hideLoading() {
    this.loading = false;
    let loading = document.getElementById("loading-event");
    loading.classList.remove("visible");
    loading.classList.add("hidden");
  }

  openEventTeamsPage() {
    if (this.my_comp) {
      let loading = this.loadCtrl.create({
        content: 'Loading information...'
      });

      loading.present().then(() => {
        this.navCtrl.push(EventTeamsPage, {
          event: this.my_comp
        }).then(() => {
          loading.dismiss();
        });
      });
    }
  }

  openEventMatchesPage() {
    if (this.my_comp) {
      let loading = this.loadCtrl.create({
        content: 'Loading information...'
      });

      loading.present().then(() => {
        this.navCtrl.push(EventMatchesPage, {
          event: this.my_comp
        }).then(() => {
          loading.dismiss();
        });
      });
    }
  }

  openEventRankingsPage() {
    if (this.my_comp) {
      let loading = this.loadCtrl.create({
        content: 'Loading information...'
      });

      loading.present().then(() => {
        this.navCtrl.push(EventRankingsPage, {
          event: this.my_comp
        }).then(() => {
          loading.dismiss();
        });
      });
    }
  }

  openEventAwardsPage() {
    if (this.my_comp) {
      let loading = this.loadCtrl.create({
        content: 'Loading information...'
      });

      loading.present().then(() => {
        this.navCtrl.push(EventAwardsPage, {
          event: this.my_comp
        }).then(() => {
          loading.dismiss();
        });
      });

    }
  }

  openEventElimsPage() {
    if (this.my_comp) {
      let loading = this.loadCtrl.create({
        content: 'Loading information...'
      });

      loading.present().then(() => {
        this.navCtrl.push(EventElimsPage, {
          event: this.my_comp
        }).then(() => {
          loading.dismiss();
        });
      });
    }
  }

  getMyEvent(event) {
      this.showLoading();
      this.tba.requestCompleteEventInfo(event)
        .subscribe(
          data => {
            this.my_comp = data[0];
            this.my_comp.teams = data[1];
            this.my_comp.matches = data[2];
            this.my_comp.stats = data[3];
            this.my_comp.ranks = data[4];
            this.my_comp.awards = data[5];
            this.my_comp.points = data[6];
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
            this.hideLoading();
          }
        );
    }

}
