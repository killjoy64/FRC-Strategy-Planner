/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { Config } from "../../util/config";
import { ModalController } from "ionic-angular";
import { LibrariesModal } from "../../modals/settings-libraries-modal/settings-libraries-modal";
import {LoggerModal} from "../../modals/settings-logger-modal/settings-logger-modal";

@Component({
  selector: 'page-settings',
  templateUrl: 'tab-settings.html'
})
export class SettingsPage {

  team_number: number;
  version: string;

  constructor(public modalCtrl: ModalController) {
    this.team_number = Config.TEAM_NUMBER;
    this.version = Config.VERSION;
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
