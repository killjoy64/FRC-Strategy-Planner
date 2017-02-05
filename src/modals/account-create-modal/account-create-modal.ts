/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { ViewController, LoadingController, AlertController } from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";
import { FirebaseService } from "../../providers/firebase-provider";
import { LoggerLevel, DebugLogger } from "../../util/debug-logger";

@Component({
  selector: 'page-account-create',
  templateUrl: 'account-create-modal.html',
  providers: [FirebaseService]
})
export class AccountCreateModal {

  connection: ConnectionManager;

  name: string;
  team: number;
  email: string;
  password: string;
  invalidMsg: string;

  constructor(private viewCtrl: ViewController, private loadCtrl: LoadingController, private alertCtrl: AlertController, private fb: FirebaseService) {
    this.connection = new ConnectionManager();
    this.connection.setLoadController(this.loadCtrl);
    this.connection.setAlertController(this.alertCtrl);

    this.name = null;
    this.team = null;
    this.email = null;
    this.password = null;
    this.invalidMsg = null;
  }

  validateInfo() {
    if (!this.name || this.name.length < 1 || !this.name.match(/^[0-9a-zA-Z\s]*$/)) {
      this.invalidMsg = "You must provide a valid name.";
      return;
    }
    if (!this.team || this.team < 0) {
      this.invalidMsg = "You must provide a valid team number.";
      return;
    }
    if (!this.email || !this.email.match(/^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/)) {
      this.invalidMsg = "You must provide a valid email address.";
      return;
    }
    if (!this.password || this.password.length <= 5) {
      this.invalidMsg = "You must provide a valid password of at least 6 characters.";
      return;
    }

    this.invalidMsg = null;
    this.createAccount(this.name, this.team, this.email, this.password);
  }

  createAccount(name, team, newEmail, newPass) {
    this.connection.showLoader("Connecting to database...", 5000);

    try {
      this.fb.createUser(newEmail, newPass, team).then((user: firebase.User) => {
        this.fb.createTeamAccount(name, newEmail, team, user.uid).then(() => {
          this.connection.hideLoader();
        }).catch((error) => {
          this.connection.hideLoader().then(() => {
            this.connection.showAlert("Error", "Error assigning user to team. " + error.message);
            DebugLogger.log(LoggerLevel.ERROR, "Error assigning user to team: " + error.message);
          });
        });
      }).catch((error) => {
        this.connection.hideLoader().then(() => {
          this.connection.showAlert("Error", "Error creating account. " + error.message);
          DebugLogger.log(LoggerLevel.ERROR, "Error creating account: " + error.message);
        });
      });
    } catch (ex) {
      DebugLogger.log(LoggerLevel.ERROR, "Error creating account: " + ex);
    }

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
