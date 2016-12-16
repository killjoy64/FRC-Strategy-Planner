import { Component } from '@angular/core';
import { TabsPage } from '../tab-directory/tab-directory';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {

  }

  login(offlineMode) {
    if (!offlineMode) {
      console.log("Logging in!");
    } else {
      console.log("Offline mode!");
    }
    this.navCtrl.push(TabsPage, {}, {duration:750});
  }

}
