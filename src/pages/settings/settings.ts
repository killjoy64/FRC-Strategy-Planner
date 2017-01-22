import { Component } from '@angular/core';
import { Deploy } from '@ionic/cloud-angular';
import {NavController, LoadingController, AlertController, ModalController} from 'ionic-angular';
import { Config } from '../../util/config';
import { AboutLibrariesPage } from '../../pages/about-libraries/about-libraries';
import { AppDirectory } from "../../util/file-reader";
import {LoggerModal} from "../../modals/logger-modal/logger-modal";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  version: string;

  team_number: number;
  push_notifications: boolean;
  auto_receive: boolean;
  auto_save: boolean;

  constructor(private modalCtrl: ModalController, private navCtrl: NavController, private deploy: Deploy, private loadCtrl: LoadingController, private alertCtrl: AlertController) {
    this.version = Config.VERSION;

    if (Config.TEAM_NUMBER) {
      this.team_number = Config.TEAM_NUMBER;
    }

  }

  ionViewWillLeave() {
    if (this.team_number) {
      Config.TEAM_NUMBER = this.team_number;
    }
    AppDirectory.saveConfig();
  }

  enablePushNotifications() {
    console.log("Updating push notifications to: " + this.push_notifications);
  }

  enableAutoReceive() {
    console.log("Updating auto receive to: " + this.auto_receive);
  }

  enableAutoSaveMyEvent() {
    console.log("Updating auto receive to: " + this.auto_save);
  }

  openChangeLog() {
    console.log("Changelog!");
  }

  openLibraries() {
    console.log("Libraries!");
    this.navCtrl.push(AboutLibrariesPage);
  }

  openDebugLog() {
    let modal = this.modalCtrl.create(LoggerModal);
    modal.present();
  }

  checkForUpdate() {
    console.log("Checking for updates...");

    let loading = this.loadCtrl.create({
      content: 'Checking for updates....'
    });

    loading.present().then(() => {
      console.log("Now checking for update...");
      this.deploy.check().then((snapshotAvailable: boolean) => {
        console.log("Found something!");
        loading.dismiss().then(() => {
          if (snapshotAvailable) {
            // When snapshotAvailable is true, you can apply the snapshot
            let self = this;
            let alert = this.alertCtrl.create({
              title: 'Update Available',
              message: 'Would you like to download?',
              buttons: [
                {
                  text: 'No',
                  role: 'cancel',
                  handler: () => {
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    self.update();
                  }
                }
              ]
            });
            alert.present();
          } else {
            let alert = this.alertCtrl.create({
              title: 'No Update Found',
              message: 'You are up-to-date!',
              buttons: [
                {
                  text: 'Ok',
                  role: 'cancel',
                  handler: () => {
                  }
                },
              ]
            });
            alert.present();
          }
        });
      }, (err) => {
        loading.dismiss().then(() => {
          let self = this;
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: 'Error checking for updates. Are you connected to the internet?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  self.update();
                }
              }
            ]
          });
          alert.present();
        });
      });
    });
  }

  update() {

    let loading = this.loadCtrl.create({
      content: 'Downloading update...'
    });

    loading.present().then(() => {
      console.log("Now downloading update...");
      this.deploy.download().then(() => {
        this.deploy.extract().then(() => {
          loading.dismiss().then(() => {
            let self = this;
            let alert = this.alertCtrl.create({
              title: 'Update Downloaded!',
              message: 'A restart of your device is required to complete deployment. Would you like to do this now?',
              buttons: [
                {
                  text: 'Later',
                  role: 'cancel',
                  handler: () => {
                  }
                },
                {
                  text: 'Apply Now',
                  role: 'cancel',
                  handler: () => {
                    self.applyUpdate();
                  }
                }
              ]
            });
            alert.present();
          });
        })
      });
    });
  }

  applyUpdate() {
    this.deploy.load();
  }

}
