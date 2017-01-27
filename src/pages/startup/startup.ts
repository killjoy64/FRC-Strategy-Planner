import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";
import {TabsPage} from "../tab-directory/tab-directory";

import { Style } from '../../util/style';

@Component({
  selector: 'page-start',
  templateUrl: 'startup.html'
})
export class StartupPage {

  connection: ConnectionManager;

  constructor(public navCtrl: NavController) {
    this.connection = new ConnectionManager();

    this.connection.getConnection().then((resolved) => {
      console.log("Connected: " + resolved);
    });
  }

  ionViewDidEnter() {

    setTimeout(() => {
      this.animateIntro();
    }, 1000);

  }

  animateIntro() {
    Style.fadeOut("spinner").then(() => {
      document.getElementById("logo").classList.add("slid-up");
      this.showLoginPartial();
    });
  }

  showLoginPartial() {
    if (document.getElementById("create-partial").classList.contains("hidden")) {
      Style.fadeIn("login-partial").then(() => {
      });
    } else {
      Style.fadeOut("create-partial").then(() => {
        Style.fadeIn("login-partial").then(() => {
        });
      });
    }
  }

  showCreatePartial() {
    Style.fadeOut("login-partial").then(() => {
      Style.fadeIn("create-partial").then(() => {
      });
    });
  }

  validateInfo() {

  }

  openTabs() {

    this.navCtrl.push(TabsPage);

  }

}
