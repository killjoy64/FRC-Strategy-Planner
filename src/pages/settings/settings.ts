import { Component } from '@angular/core';
import { Deploy } from '@ionic/cloud-angular';
import { NavController } from 'ionic-angular';
import { Config } from '../../util/config';
import { AboutLibrariesPage } from '../../pages/about-libraries/about-libraries';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  team_number: number;
  push_notifications: boolean;
  auto_receive: boolean;

  constructor(private navCtrl: NavController, private deploy: Deploy) {

  }

  ionViewWillLeave() {
    if (this.team_number) {
      Config.TEAM_NUMBER = this.team_number;
    }
    console.log(Config.TEAM_NUMBER);
  }

  enablePushNotifications() {
    console.log("Updating push notifications to: " + this.push_notifications);
  }

  enableAutoReceive() {
    console.log("Updating auto receive to: " + this.auto_receive);
  }

  openChangeLog() {
    console.log("Changelog!");
  }

  openLibraries() {
    console.log("Libraries!");
    this.navCtrl.push(AboutLibrariesPage);
  }

  checkForUpdate() {
    console.log("Checking for updates...");
  }

}
