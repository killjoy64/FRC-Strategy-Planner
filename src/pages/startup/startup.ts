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
      this.showLoginPartial();
    }, 1000);

  }

  showLoginPartial() {
    Style.fadeOut("spinner").then(() => {
      document.getElementById("logo").classList.add("slid-up");
      Style.fadeIn("login-partial").then(() => {
        console.log("done fading in");
      });
    });
  }

  showCreatePartial() {

  }

  openTabs() {

    this.navCtrl.push(TabsPage);

  }

}
