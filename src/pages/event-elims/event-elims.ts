import {Component, ViewChild} from '@angular/core';
import {NavParams, Content, ActionSheetController, ModalController} from 'ionic-angular';
import {PhotoViewer} from 'ionic-native';
import {TeamSorter} from "../../util/sorting";
import {TeamNotesModal} from '../../modals/team-notes-modal';
import {MyEvent} from "../../util/file-reader";

@Component({
  selector: 'page-event-elims',
  templateUrl: 'event-elims.html'
})
export class EventElimsPage {

  @ViewChild(Content) content: Content;

  eventData: MyEvent;
  teamSorter: TeamSorter;

  pickList: any;
  noList: any;

  event: any;
  teams: any;

  constructor(private navParams: NavParams, private actionCtrl: ActionSheetController, private modalCtrl: ModalController) {
    this.teamSorter = new TeamSorter();
    this.event = navParams.get("event");
    this.teams = this.teamSorter.quicksort(this.event.teams, 0, this.event.teams.length - 1);
    this.pickList = [];
    this.noList = [];
  }

  ionViewWillLeave() {
    let needToCache = false;

    if (this.pickList.length > 0) {
      this.event.pickList = this.pickList;
      needToCache = true;
    }

    if (this.noList.length > 0) {
      this.event.noList = this.noList;
      needToCache = true;
    }

    if (needToCache) {
      this.eventData = new MyEvent();
      this.eventData.saveMyEvent(this.event).then((file) => {
        // saved
        console.log("Successfully cached the event");
      }, (err) => {
        // :(
        console.log("Error savcing event data!");
      });
    }
  }

  ionViewWillEnter() {
    if (this.event.pickList) {
      this.pickList = this.event.pickList;
    }

    if (this.event.noList) {
      this.noList = this.event.noList;
    }
  }

  ionViewDidEnter() {

    if (this.pickList) {
      console.log("cached picklist");
      let robots = document.getElementsByClassName("team-elim");
      for (let i = 0; i < this.pickList.length; i++) {
        for (let j = 0; j < robots.length; j++) {
          if (robots[j].innerHTML.indexOf(this.pickList[i].team_number) > 0) {
            robots[j].classList.add("pick-me");
            robots[j].classList.remove("do-not-pick");
          }
        }
      }
    }

    if (this.noList) {
      console.log("cached nolist");
      let robots = document.getElementsByClassName("team-elim");
      for (let i = 0; i < this.noList.length; i++) {
        for (let j = 0; j < robots.length; j++) {
          if (robots[j].innerHTML.indexOf(this.noList[i].team_number) > 0) {
            robots[j].classList.add("do-not-pick");
            robots[j].classList.remove("pick-me");
          }
        }
      }
    }

  }

  showTeamSheet(team, target) {
    let actionSheet = this.actionCtrl.create({
      title: 'Team ' + team.team_number,
      buttons: [
        {
          text: 'View Robot',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              if (team.avatar_url) {
                PhotoViewer.show(team.avatar_url, 'Team ' + team.team_number);
              }
            });
            return false;
          }
        },
        {
          text: 'View Notes',
          handler: () => {
            let modal = this.modalCtrl.create(TeamNotesModal, {
              team: team
            });
            modal.onDidDismiss(data => {
              console.log(data);
            });
            modal.present();
          }
        },
        {
          text: 'Add to Pick List',
          handler: () => {

            if (this.pickList.indexOf(team) >= 0) {
              this.pickList.splice(this.pickList.indexOf(team), 1);
            }

            if (this.noList.indexOf(team) >= 0) {
              this.noList.splice(this.noList.indexOf(team), 1);
            }

            this.pickList.push(team);

            let robots = document.getElementsByClassName("team-elim");

            for (let i = 0; i < robots.length; i++) {
              if (robots[i].innerHTML.indexOf(team.team_number) > 0) {
                robots[i].classList.add("pick-me");
                robots[i].classList.remove("do-not-pick");
              }
            }

          }
        },
        {
          text: 'Add to DO NOT Pick List',
          handler: () => {

            if (this.pickList.indexOf(team) >= 0) {
              this.pickList.splice(this.pickList.indexOf(team), 1);
            }

            if (this.noList.indexOf(team) >= 0) {
              this.noList.splice(this.noList.indexOf(team), 1);
            }

            this.noList.push(team);

            let robots = document.getElementsByClassName("team-elim");

            for (let i = 0; i < robots.length; i++) {
              if (robots[i].innerHTML.indexOf(team.team_number) > 0) {
                robots[i].classList.add("do-not-pick");
                robots[i].classList.remove("pick-me");
              }
            }

          }
        }
      ]
    });

    actionSheet.present();
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
    let robots = document.getElementsByClassName("team-elim");
    for (let i = 0; i < robots.length; i++) {
      robots[i].classList.remove("selected");
    }
    e.target.classList.add("selected");

    this.showTeamSheet(team, e.target);
  }

}
