/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component, NgZone, ViewChild } from '@angular/core';
import { NavParams, ActionSheetController, Content } from "ionic-angular";
import { DebugLogger, LoggerLevel } from "../../util/debug-logger";
import { Camera, Entry, PhotoViewer } from "ionic-native";
import { FileMover, AppDirectory } from "../../util/file-manager";
import { DomSanitizer } from "@angular/platform-browser";
import { MatchSorter } from "../../util/object-sorter";
import { MatchConverter } from "../../util/string-converter";

@Component({
  selector: 'page-event-team',
  templateUrl: 'event-team.html'
})
export class EventTeamPage {

  @ViewChild(Content) content;

  match_converter: MatchConverter;

  event: any;
  team: any;

  base64_string: any;
  view: string;

  constructor(private navParams: NavParams, private actionCtrl: ActionSheetController, private zone: NgZone, private sanitizer: DomSanitizer) {

    if (this.navParams.get("event")) {
      this.event = this.navParams.get("event");
    } else {
      this.event = null;
    }

    if (this.navParams.get("team")) {
      this.team = this.navParams.get("team");
    } else {
      this.team = null;
    }

    this.match_converter = new MatchConverter();

    this.base64_string = null;
    this.view = null;
  }

  ionViewWillEnter() {
    this.resizePhoto();
    this.showInfo();
  }

  showInfo() {
    this.toggleButton("info-btn");
    this.view = 'info';
  }

  showPitInfo() {
    this.toggleButton("team-pit-btn");
    this.view = 'pit';
  }

  showStats() {
    this.toggleButton("team-stats-btn");
    this.view = 'stats';
  }

  showMatches() {
    this.toggleButton("team-matches-btn");
    this.view = 'matches';
  }

  private clearActiveButtons() {
    let buttons = document.getElementsByClassName("profile-button");

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active-button");
    }
  }

  private toggleButton(id) {
    let btn = document.getElementById(id);
    if (btn.classList.contains("active-button")) {
      this.clearActiveButtons();
      return false;
    } else {
      this.clearActiveButtons();
      btn.classList.add("active-button");
      return true;
    }
  }

  checkTeam(team) {
    let team_string = team.substring(3, team.length);

    if (team_string.indexOf(this.team.team_number + "") > -1) {
      return true;
    } else {
      return false;
    }
  }

  convert(string) {
    if (string.indexOf("sponsor") > -1) {
      return string.substring(0, string.indexOf("sponsor"));
    } else {
      return string;
    }
  }

  checkScroll(e) {
    if (e.scrollTop >= 300) {
      if (document.getElementById("scroll").classList.contains("hidden")) {
        document.getElementById("scroll").classList.remove("hidden");
        document.getElementById("scroll").classList.add("visible");
      }
    } else {
      if (document.getElementById("scroll").classList.contains("visible")) {
        document.getElementById("scroll").classList.remove("visible");
        document.getElementById("scroll").classList.add("hidden");
      }
    }
  }

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

  resizePhoto() {

    if (this.team.photo_url) {

      this.convertImageToBase(this.team.photo_url).then((image_data) => {
        this.base64_string = image_data;

        DebugLogger.log(LoggerLevel.INFO, "Converted image to base64 string.");

        let int = setInterval(() => {
          let img = document.getElementsByClassName("event-team-photo-container")[0].querySelector("img");
          if (img.clientHeight > 0 && img.clientWidth > 0) {
            if (img.clientHeight > img.clientWidth) {
              // Height > Width, which is portrait mode
              img.classList.remove("photo-landscape");
              img.classList.add("photo-portrait");
            } else {
              img.classList.remove("photo-portrait");
              img.classList.add("photo-landscape");
            }
            clearInterval(int);
          }
        }, 100);
      });
    } else {
      let img = document.getElementsByClassName("event-team-photo-container")[0].querySelector("img");

      setTimeout(() => {
        if (img.clientHeight > img.clientWidth) {
          // Height > Width, which is portrait mode
          img.classList.remove("photo-landscape");
          img.classList.add("photo-portrait");
        } else {
          img.classList.remove("photo-portrait");
          img.classList.add("photo-landscape");
        }
      }, 175);
    }

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
              if (self.team.photo_url) {
                PhotoViewer.show(self.team.photo_url, 'Team ' + self.team.team_number);
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
      correctOrientation: true,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      quality: 100,
      targetWidth: 720,
      targetHeight: 720
    }).then((imageData) => {
      self.team.photo_url = null;

      let currentName = imageData.replace(/^.*[\\\/]/, '');
      if (currentName.indexOf("?") > -1) {
        currentName = currentName.substring(0, currentName.indexOf("?"));
      }
      FileMover.move(AppDirectory.getTempDir(), AppDirectory.getPermDir(), currentName, "robots/" + self.team.team_number + ".jpg").then((data:Entry) => {
        // self.team_photo = AppDirectory.getPermDir() + "robots/" + self.team.team_number + ".jpg";
        this.zone.run(() => {
          self.sanitizer.bypassSecurityTrustUrl(data.toURL());
          self.team.photo_url = data.toURL();
          document.getElementsByClassName("team-photo-container")[0].querySelector("img").src = data.toURL();
          DebugLogger.log(LoggerLevel.INFO, "Successfully moved file " + self.team.photo_url);
        });

        this.resizePhoto();
      }).catch((err) => {
        DebugLogger.log(LoggerLevel.ERROR, self.team.team_number + ".jpg " + err.message + " " + err.code);
      });
    }, (err) => {
      if (!self.team.photo_url) {
        self.team.photo_url = null;
      }
      DebugLogger.log(LoggerLevel.ERROR, err);
    });
  }

  takePicture() {
    let self = this;

    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      quality: 100,
      targetWidth: 720,
      targetHeight: 720
    }).then((imageData) => {
      self.team.photo_url = null;

      let currentName = imageData.replace(/^.*[\\\/]/, '');
      FileMover.move(AppDirectory.getTempDir(), AppDirectory.getPermDir(), currentName, "robots/" + self.team.team_number + ".jpg").then((data:Entry) => {
        // self.team_photo = AppDirectory.getPermDir() + "robots/" + self.team.team_number + ".jpg";

        this.zone.run(() => {
          self.sanitizer.bypassSecurityTrustUrl(data.toURL());
          self.team.photo_url = data.toURL();
          document.getElementsByClassName("team-photo-container")[0].querySelector("img").src = data.toURL();
          DebugLogger.log(LoggerLevel.INFO, "Successfully moved file " + self.team.photo_url);
        });

        this.resizePhoto();
      }).catch((err) => {
        DebugLogger.log(LoggerLevel.ERROR, self.team.team_number + ".jpg " + err.message + " " + err.code);
      });
    }, (err) => {
      if (!self.team.photo_url) {
        self.team.photo_url = null;
      }
      DebugLogger.log(LoggerLevel.ERROR, err);
    });
  }

  convertImageToBase(url) {
    return new Promise( (resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function(){
        let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL("image/jpeg");
        //callback(dataURL);
        canvas = null;
        resolve(dataURL);
      };
      img.src = url;
    });
  }

}
