import { Component } from '@angular/core';

import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";
import { TabsPage } from "../tab-directory/tab-directory";

import { Style } from '../../util/style';
import { FirebaseService } from "../../providers/firebase-provider";

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
  }

  showCreatePartial() {
    Style.translateX("login-partial", -125).then(() => {});
    Style.translateX("create-partial", 0).then(() => {});
  }

  validateInfo() {
    if (!this.name || this.name.length < 1) {
      return;
    }
    if (!this.team || this.team < 0) {
      return;
    }
    if (!this.newPass || this.newPass.length < 6) {
      return;
    }
    this.createAccount(this.name, this.team, this.newEmail, this.newPass);
  }

  createAccount(name, team, newEmail, newPass) {
      this.connection.showLoader("Connecting to database...", 5000);
      // setTimeout(() => {
      //   this.connection.hideLoader();
      // }, 2000);
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
