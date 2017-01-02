import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content, ActionSheetController} from 'ionic-angular';
import {MatchSorter} from '../../util/sorting';
import {MatchConverter} from '../../util/string-converter';
import {Camera, File, Entry, FileError} from "ionic-native";
import {TeamAvatar, AppDirectory} from '../../util/file-reader';
import {DomSanitizer} from '@angular/platform-browser';
import {Config} from '../../util/config';

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
  teamAvatar: TeamAvatar;
  team: any;
  event: any;
  matches: any;
  sorted_matches: any;

  constructor(private navCtrl: NavController, private navParams: NavParams, private actionCtrl: ActionSheetController, public santizer: DomSanitizer) {
    this.matchSorter = new MatchSorter();
    this.matchConverter = new MatchConverter();
    this.team = navParams.get("team");
    this.event = navParams.get("event");
    this.matches = [];

    let self = this;

    if (!Config.IS_BROWSER) {
      this.teamAvatar = new TeamAvatar();
      this.teamAvatar.getAvatar(this.team.team_number).then((data) => {
        self.src = data;
      }, (err) => {
        console.log(err);
      });
    }

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

    this.sorted_matches = this.matchSorter.quicksort(this.matches, 0, this.matches.length - 1);

  }

  ngAfterViewInit() {
    this.content.addScrollListener((e) => {
      let scroll = document.getElementById("scroll");
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

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

  openPictureSheet() {
    let self = this;
    let actionSheet = this.actionCtrl.create({
      title: 'Change Team Photo',
      buttons: [
        {
          text: 'View Photo',
          handler: () => {
          }
        },
        {
          text: 'Take Picture',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              // this.navCtrl.push(CameraPreviewPage, {
              //   "team": this.team.team_number
              // });
              self.takePicture();
            });
          }
        },
        {
          text: 'Import from Camera Roll',
          handler: () => {
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
      self.src = imageData;
      File.moveFile(AppDirectory.getTempDir(), currentName, AppDirectory.getPermDir(), "avatars/" + self.team.team_number + ".jpg").then((entry) => {
        console.log("SUCCESSFULLY MOVED FILE");
      }).catch((err) => {
        console.log("ERROR MOVING FILE: " + err.message);
      });
      console.log(this.src);
    }, (err) => {
      if (!self.src) {
        self.src = null;
      }
      console.log(err);
    });
  }

}
