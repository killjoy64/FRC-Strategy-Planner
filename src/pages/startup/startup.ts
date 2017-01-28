import { Component } from '@angular/core';

import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";
import { TabsPage } from "../tab-directory/tab-directory";

import { Style } from '../../util/style';
import { FirebaseService } from "../../providers/firebase-provider";
import {DebugLogger, LoggerLevel} from "../../util/debug-logger";

@Component({
  selector: 'page-start',
  templateUrl: 'startup.html',
  providers: [FirebaseService]
})
export class StartupPage {

  connection: ConnectionManager;

  email: string;
  password: string;

  name: string;
  team: number;
  newEmail: string;
  newPass: string;
  resetEmail: string;

  invalidMsg: string;
  loginMsg: string;
  resetMsg: string;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private loadCtrl: LoadingController, private fb: FirebaseService) {
    this.connection = new ConnectionManager();
    this.connection.setLoadController(this.loadCtrl);
    this.connection.setAlertController(this.alertCtrl);

    this.email = null;
    this.password = null;

    this.name = null;
    this.team = null;
    this.newEmail = null;
    this.newPass = null;
    this.resetEmail = null;

    this.invalidMsg = null;
    this.loginMsg = null;
    this.resetMsg = null;
  }

  ionViewDidEnter() {

    setTimeout(() => {
      this.animateIntro();
    }, 1000);

  }

  animateIntro() {
    Style.fadeOut("spinner").then(() => {
      document.getElementById("logo").classList.add("slid-up");
      Style.fadeIn("login-partial").then(() => {
      });
    });
  }

  showLoginPartial() {
    Style.translateX("login-partial", 0).then(() => {});
    Style.translateX("create-partial", 125).then(() => {});
    Style.translateX("reset-partial", -125).then(() => {});
  }

  showCreatePartial() {
    Style.translateX("login-partial", -125).then(() => {});
    Style.translateX("create-partial", 0).then(() => {});
  }

  showResetPartial() {
    Style.translateX("login-partial", 125).then(() => {});
    Style.translateX("reset-partial", 0).then(() => {});
  }

  sendResetEmail() {
    if (!this.resetEmail || !this.resetEmail.match(/^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/)) {
      this.resetMsg = "You must provide a valid email address.";
      return;
    }

    this.connection.showLoader("Connecting to database...", 5000);
    this.resetMsg = null;
    this.fb.resetPassword(this.resetEmail).then(() => {
      this.connection.hideLoader().then(() => {
        this.connection.showAlert("Email Sent", "An email regarding the next steps to reset your password has been sent.");
      });
    }).catch((error) => {
      this.connection.hideLoader().then(() => {
        this.connection.showAlert("Error", "Error sending email. " + error.message);
      });
    });
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
    if (!this.newEmail || !this.newEmail.match(/^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/)) {
      this.invalidMsg = "You must provide a valid email address.";
      return;
    }
    if (!this.newPass || this.newPass.length <= 5) {
      this.invalidMsg = "You must provide a valid password of at least 6 characters.";
      return;
    }

    this.invalidMsg = null;
    this.createAccount(this.name, this.team, this.newEmail, this.newPass);
  }

  createAccount(name, team, newEmail, newPass) {
    this.connection.showLoader("Connecting to database...", 5000);

    try {
      this.fb.createUser(newEmail, newPass).then((user: firebase.User) => {
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

  login() {
    this.connection.showLoader("Connecting to database...", 5000);
    this.fb.login(this.email, this.password).then((user: firebase.User) => {
      this.connection.hideLoader().then(() => {
        this.openMainPage();
        this.loginMsg = null;
      });
    }).catch((error) =>{
      this.connection.hideLoader().then(() => {
        DebugLogger.log(LoggerLevel.ERROR, error.message);
        this.loginMsg = error.message;
      });
    });
  }

  openMainPage() {
    this.navCtrl.push(TabsPage).then(() => {
      this.navCtrl.remove(0, 1);
    });
  }

  showAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}
