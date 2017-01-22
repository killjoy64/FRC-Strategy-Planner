import {Component, ViewChild} from '@angular/core';
import {NavParams, Content, ActionSheetController, ModalController} from 'ionic-angular';
import {MatchSorter} from '../../util/sorting';
import {MatchConverter} from '../../util/string-converter';
import {Camera, File, PhotoViewer} from "ionic-native";
import {TeamAvatar, AppDirectory, TeamNotes, MyEvent} from '../../util/file-reader';
import {DomSanitizer} from '@angular/platform-browser';
import {Config} from '../../util/config';
import {TeamNotesModal} from '../../modals/team-notes-modal/team-notes-modal';

declare var cordova: any;

@Component({
  selector: 'page-event-team',
  templateUrl: 'event-team.html'
})
export class EventTeamPage {

  matchSorter: MatchSorter;
  matchConverter: MatchConverter;

  @ViewChild(Content) content: Content;

  src: any;
  eventData: MyEvent;
  teamNote: TeamNotes;
  teamAvatar: TeamAvatar;
  team: any;
  event: any;
  matches: any;
  sorted_matches: any;

  needToCache: boolean;

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private actionCtrl: ActionSheetController, public sanitizer: DomSanitizer) {
    this.matchSorter = new MatchSorter();
    this.matchConverter = new MatchConverter();
    this.eventData = new MyEvent();
    this.team = navParams.get("team");
    this.event = navParams.get("event");
    this.matches = [];

    for (let match of this.event.matches) {
      for (let i = 0; i < 3; i++) {
        if (match.alliances.blue.teams[i] == this.team.key) {
          this.matches.push(match);
        }
        if (match.alliances.red.teams[i] == this.team.key) {
          this.matches.push(match);
        }
      }
    }

    this.needToCache = false;
  }

  ionViewWillLeave() {
    if (this.needToCache) {
      this.eventData.saveMyEvent(this.event).then((file) => {
        // saved
        console.log("Successfully cached the event");
      }, (err) => {
        // :(
        console.log("Error savcing event data!");
      });
    }
  }

  ngAfterViewInit() {
    let self = this;

    if (!Config.IS_BROWSER) {
      this.teamAvatar = new TeamAvatar();
      this.teamAvatar.getAvatar(this.team.team_number).then((data) => {
        self.src = data;
      }, (err) => {
        console.log("Error getting avatar: " + err.message);
      });

      this.teamNote = new TeamNotes();
      this.teamNote.getNotes(this.team).then((data) => {
        this.team.team_notes = data;
        console.log("Team Notes: " + this.team.team_notes);
      }, (err) => {
        console.log("Error getting notes:" + err.message);
      });
    }

    this.sorted_matches = this.matchSorter.quicksort(this.matches, 0, this.matches.length - 1);
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

  openNotesModal() {
    let modal = this.modalCtrl.create(TeamNotesModal, {
      team: this.team
    });
    modal.onDidDismiss(data => {
      this.eventData.saveMyEvent(this.event).then((file) => {
        console.log("Successfully cached the event");
      }, (err) => {
        console.log("Error savcing event data!");
      });
    });
    modal.present();
  }

  openPictureSheet() {
    let self = this;
    let actionSheet = this.actionCtrl.create({
      title: 'Change Team Photo',
      buttons: [
        {
          text: 'View Photo',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              if (self.src) {
                PhotoViewer.show(self.src, 'Team ' + self.team.team_number);
              }
            });
            return false;
          }
        },
        {
          text: 'Take Picture',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              self.takePicture();
            });
            return false;
          }
        },
        {
          text: 'Import from Camera Roll',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              self.getPicture();
            });
            return false;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }

  getPicture() {
    let self = this;

    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      quality: 100,
      targetWidth: 720,
      targetHeight: 720
    }).then((imageData) => {
      let currentName = imageData.replace(/^.*[\\\/]/, '');
      if (currentName.indexOf("?") > -1) {
        currentName = currentName.substring(0, currentName.indexOf("?"));
      }
      File.moveFile(AppDirectory.getTempDir(), currentName, AppDirectory.getPermDir(), "avatars/" + self.team.team_number + ".jpg").then((entry) => {
        self.src = AppDirectory.getPermDir() + "avatars/" + self.team.team_number + ".jpg";
        self.team.avatar_url = self.src;
        self.needToCache = true;
        console.log("SUCCESSFULLY MOVED - AVATAR SRC: " + self.src);
      }).catch((err) => {
        console.log("ERROR MOVING FILE: " + err.message);
      });
      self.sanitizer.bypassSecurityTrustUrl(self.src);
    }, (err) => {
      if (!self.src) {
        self.src = null;
      }
      console.log("Error locating avatar: " + err.message);
    });
  }

  takePicture() {
    let self = this;

    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: false,
      quality: 100,
      targetWidth: 720,
      targetHeight: 720
    }).then((imageData) => {
      let currentName = imageData.replace(/^.*[\\\/]/, '');
      File.moveFile(AppDirectory.getTempDir(), currentName, AppDirectory.getPermDir(), "avatars/" + self.team.team_number + ".jpg").then((entry) => {
        self.src = AppDirectory.getPermDir() + "avatars/" + self.team.team_number + ".jpg";
        self.team.avatar_url = self.src;
        self.needToCache = true;
        console.log("SUCCESSFULLY MOVED - AVATAR SRC: " + self.src);
      }).catch((err) => {
        console.log("ERROR MOVING FILE: " + err.message);
      });
      self.sanitizer.bypassSecurityTrustUrl(self.src);
    }, (err) => {
      if (!self.src) {
        self.src = null;
      }
      console.log(err);
    });
  }

}
