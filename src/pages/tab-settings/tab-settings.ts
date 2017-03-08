/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { Config } from "../../util/config";
import {ModalController, LoadingController, AlertController} from "ionic-angular";
import { LibrariesModal } from "../../modals/settings-libraries-modal/settings-libraries-modal";
import { LoggerModal } from "../../modals/settings-logger-modal/settings-logger-modal";
import { AppDirectory } from "../../util/file-manager";
import { Deploy } from "@ionic/cloud-angular";
import { ConnectionManager } from "../../util/connection-manager";

@Component({
  selector: 'page-settings',
  templateUrl: 'tab-settings.html'
})
export class SettingsPage {

  connection: ConnectionManager;

  team_number: number;
  version: string;

  auto_save_events: boolean;

  constructor(public modalCtrl: ModalController, private deploy: Deploy, private loadCtrl: LoadingController, private alertCtrl: AlertController) {
    this.connection = new ConnectionManager();
    this.connection.setAlertController(this.alertCtrl);
    this.connection.setLoadController(this.loadCtrl);

    this.team_number = Config.TEAM_NUMBER;
    this.version = Config.VERSION;

    this.auto_save_events = Config.AUTO_SAVE_EVENT;

    if (!Config.IS_BROWSER) {
      window.addEventListener('native.keyboardshow', () => {
        document.body.classList.add("keyboard-is-open");
      });

      window.addEventListener('native.keyboardhide', () => {
        document.body.classList.remove("keyboard-is-open");
      });
    }
  }

  ionViewWillLeave() {
    let should_save = false;

    if (this.team_number != Config.TEAM_NUMBER) {
      Config.TEAM_NUMBER = this.team_number;
      should_save = true;
    }
    if (this.auto_save_events != Config.AUTO_SAVE_EVENT) {
      Config.AUTO_SAVE_EVENT = this.auto_save_events;
      should_save = true;
    }

    if (should_save) {
      AppDirectory.saveConfig();
    }
  }

  checkForUpdate() {
    this.connection.showLoader("Contacting update server...", 5000).then(() => {
      this.deploy.check().then((snapshotAvailable: boolean) => {
        this.connection.hideLoader().then(() => {
          if (snapshotAvailable) {
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
                    this.applyUpdate();
                  }
                }
              ]
            });
            alert.present();
          } else {
            this.connection.showAlert("FRCSP Update Service", "No update found. Currently the latest version!");
          }
        })
      });
    }).catch((err) => {
      this.connection.hideLoader().then(() => {
        this.connection.showAlert("Network Error", "Error contacting update service. Are you connected to the internet?");
      });
    });
  }

  // TODO - Add progress handler to extract & deploy (p: number) on extract & deploy

  applyUpdate() {
    this.connection.showLoader("Downloading update...", 15000).then(() => {
      this.deploy.download().then(() => {
        this.deploy.extract().then(() => {
          this.connection.hideLoader().then(() => {
            let alert = this.alertCtrl.create({
              title: 'Update Downloaded',
              message: 'A restart of your device is required to complete deployment. Would you like to do this now?',
              buttons: [
                {
                  text: 'Later',
                  role: 'cancel',
                  handler: () => {}
                },
                {
                  text: 'Apply Now',
                  role: 'cancel',
                  handler: () => {
                    this.deploy.load();
                  }
                }
              ]
            });
            alert.present();
          })
        }).catch((err) => {
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: 'There was an error extracting the package: ' + err,
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                handler: () => {}
              }
            ]
          });
          alert.present();
        });
      });
    });
  }

  openLibraries() {
    let libraryModal = this.modalCtrl.create(LibrariesModal);
    libraryModal.present();
  }

  openChangeLog() {

  }

  openDebugLog() {
    let debugModal = this.modalCtrl.create(LoggerModal);
    debugModal.present();
  }

}
