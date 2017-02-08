/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { ModalController } from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";
import { Config } from "../../util/config";
import { AccountLoginModal } from "../../modals/account-login-modal/account-login-modal";
import { AccountCreateModal } from "../../modals/account-create-modal/account-create-modal";
import { FirebaseService } from "../../providers/firebase-provider";

@Component({
  selector: 'page-my-cloud',
  templateUrl: 'tab-my-cloud.html',
  providers: [FirebaseService]
})
export class CloudPage {

  connection: ConnectionManager;

  user: any;

  constructor(private modalCtrl: ModalController, private fb: FirebaseService) {
    this.connection = new ConnectionManager();
    this.user = Config.FIREBASE_USER;

    if (!Config.IS_BROWSER) {
      window.addEventListener('native.keyboardshow', () => {
        document.body.classList.add("keyboard-is-open");
      });

      window.addEventListener('native.keyboardhide', () => {
        document.body.classList.remove("keyboard-is-open");
      });
    }
  }

  // TODO - Check if this fires after a modal is dismissed
  ionViewWillEnter() {
    if (this.user) {
      this.fb.isAuthorized(this.user.uid);
    }
  }

  openLoginModal() {
    let modal = this.modalCtrl.create(AccountLoginModal);
    modal.onDidDismiss((data) => {
      if (data && data.user) {
        this.user = data.user;
      }
    });
    modal.present();
  }

  openCreateModal() {
    let modal = this.modalCtrl.create(AccountCreateModal);
    modal.onDidDismiss((data) => {
      if (data && data.user) {
        this.user = data.user;
      }
    });
    modal.present();
  }

}
