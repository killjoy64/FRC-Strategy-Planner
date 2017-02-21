/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { Config } from "../../util/config";
import { ModalController } from "ionic-angular";
import { LibrariesModal } from "../../modals/settings-libraries-modal/settings-libraries-modal";
import {LoggerModal} from "../../modals/settings-logger-modal/settings-logger-modal";
import {AppDirectory} from "../../util/file-manager";

@Component({
  selector: 'page-settings',
  templateUrl: 'tab-settings.html'
})
export class SettingsPage {

  team_number: number;
  version: string;

  auto_save_events: boolean;

  constructor(public modalCtrl: ModalController) {
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
