/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component, ViewChild, NgZone } from '@angular/core';
import {
  NavController, NavParams, Content, ActionSheetController, LoadingController,
  AlertController
} from 'ionic-angular';
import { AwardSorter, EventSorter } from "../../util/object-sorter";
import { DomSanitizer } from '@angular/platform-browser';
import { PhotoViewer, Camera, Entry } from "ionic-native";
import { AppDirectory, FileMover } from "../../util/file-manager";
import { DebugLogger, LoggerLevel } from "../../util/debug-logger";
import { TBAService } from "../../providers/tba-provider";
import { ConnectionManager } from "../../util/connection-manager";
import { EventPage } from "../event/event";

@Component({
  selector: 'page-team',
  templateUrl: 'team.html',
  providers: [TBAService]
})
export class TeamPage {

  @ViewChild(Content) content: Content;

  connection: ConnectionManager;

  awardSorter: AwardSorter;
  eventSorter: EventSorter;

  team: any;
  // team_photo: string;
  view: string;

  base64_string: any;

  constructor(public sanitizer: DomSanitizer, private alertCtrl: AlertController, private loadCtrl: LoadingController, private tba: TBAService, private navCtrl: NavController, private navParams: NavParams, private actionCtrl: ActionSheetController, private zone: NgZone) {
    this.connection = new ConnectionManager();
    this.connection.setLoadController(this.loadCtrl);
    this.connection.setAlertController(this.alertCtrl);

    this.awardSorter = new AwardSorter();
    this.eventSorter = new EventSorter();

    this.view = null;
    this.base64_string = null;

    if (this.navParams.get("team")) {
      this.team = this.navParams.get("team");
    } else {
      this.team = null;
    }
  }

  ionViewWillEnter() {
    this.resizePhoto();
    this.showAbout();

    this.assignAwardEvents().then(() => {
      this.eventSorter.sort(this.team.events, 0, this.team.events.length - 1);
      this.awardSorter.sort(this.team.awards, 0, this.team.awards.length - 1);
    });
  }

  resizePhoto() {

    if (this.team.photo_url) {

      this.convertImageToBase(this.team.photo_url).then((image_data) => {
        this.base64_string = image_data;

        DebugLogger.log(LoggerLevel.INFO, "Converted image to base64 string.");

        let int = setInterval(() => {
          let img = document.getElementsByClassName("team-photo-container")[0].querySelector("img");
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
      let img = document.getElementsByClassName("team-photo-container")[0].querySelector("img");

      setTimeout(() => {
        if (img.clientHeight > img.clientWidth) {
          // Height > Width, which is portrait mode
          img.classList.remove("photo-landscape");
          img.classList.add("photo-portrait");
        } else {
          img.classList.remove("photo-portrait");
          img.classList.add("photo-landscape");
        }
      }, 100);
    }

  }

  showAbout() {
    this.toggleButton("about-btn");
    this.view = 'about';
  }

  showPitInfo() {
    this.toggleButton("pit-btn");
    this.view = 'pit';
  }

  showAwards() {
    this.toggleButton("awards-btn");
    this.view = 'awards';
  }

  showEvents() {
    this.toggleButton("events-btn");
    this.view = 'events';
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

  openEventPage(e_key) {
    this.connection.showLoader("Reaching Database...", 10000);
    this.tba.requestCompleteEventInfo(e_key).subscribe((data) => {
      let eventInfo = data[0];
      eventInfo.teams = data[1];
      eventInfo.matches = data[2];
      eventInfo.stats = data[3];
      eventInfo.ranks = data[4];
      eventInfo.awards = data[5];
      eventInfo.points = data[6];

      this.connection.hideLoader();

      this.navCtrl.push(EventPage, {
        event: eventInfo
      });
    }, (err) => {
      this.connection.hideLoader().then(() => {
        this.connection.showAlert("Error", "Could not complete request. " + err);
      });
    });
  }

  private assignAwardEvents() {
    return new Promise((resolve) => {
      for (let i = 0; i < this.team.awards.length; i++) {

        let award_event_key = this.team.awards[i].event_key;

        for (let j = 0; j < this.team.events.length; j++) {
          let event_key = this.team.events[j].key;
          if (award_event_key == event_key) {
            this.team.awards[i].event_name = this.team.events[j].short_name;
            this.team.awards[i].event_week = this.team.events[j].week;
            this.team.awards[i].event_start_date = this.team.events[j].start_date;
            break;
          }
        }
      }
      resolve();
    });
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
