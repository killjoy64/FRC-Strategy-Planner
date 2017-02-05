/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { ViewController, LoadingController, AlertController } from 'ionic-angular';
import { Config } from "../../util/config";
import { ConnectionManager } from "../../util/connection-manager";
import { FirebaseService } from "../../providers/firebase-provider";
import {DebugLogger, LoggerLevel} from "../../util/debug-logger";

@Component({
  selector: 'page-account-login',
  templateUrl: 'account-login-modal.html',
  providers: [FirebaseService]
})
export class AccountLoginModal {

  connection: ConnectionManager;

  email: string;
  password: string;
  loginMsg: string;

  user: firebase.User;

  constructor(private viewCtrl: ViewController, private loadCtrl: LoadingController, private alertCtrl: AlertController, private fb: FirebaseService) {
    this.connection = new ConnectionManager();
    this.connection.setLoadController(this.loadCtrl);
    this.connection.setAlertController(this.alertCtrl);

    this.email = null;
    this.password = null;
    this.loginMsg = null;
  }

  login() {
    this.connection.showLoader("Connecting to database...", 5000);
    this.fb.login(this.email, this.password).then((user: firebase.User) => {
      this.connection.hideLoader().then(() => {
        this.loginMsg = null;
        this.user = user;
        this.dismiss();
      });
    }).catch((error) =>{
      this.connection.hideLoader().then(() => {
        DebugLogger.log(LoggerLevel.ERROR, error.message);
        this.loginMsg = error.message;
      });
    });
  }

  dismiss() {
    this.viewCtrl.dismiss({
      user: this.user
    });
  }

  openResetAlert() {
    let alert = this.alertCtrl.create({
      title: 'Reset Password',
      message: 'Enter the email linked to your account. An email will be sent regarding the next steps.',
      inputs: [
        {
          name: 'email',
          placeholder: 'example@hotmail.com'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Send',
          handler: (data) => {
            alert.dismiss().then(() => {
              this.connection.showLoader("Sending email...", 5000);
              this.fb.resetPassword(data.email).then(() => {
                this.connection.hideLoader();
              }, (err) => {
                DebugLogger.log(LoggerLevel.ERROR, "Error sending email: " + err.message);
              });
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

}
