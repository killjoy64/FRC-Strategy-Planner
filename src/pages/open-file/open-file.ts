import { Component } from '@angular/core';
import { File, Entry } from 'ionic-native';
import { NavController, Platform } from 'ionic-angular';
import { FieldPage } from '../field/field';

declare var cordova: any;

@Component({
  selector: 'open-file',
  templateUrl: 'open-file.html'
})
export class OpenFilePage {

  fs:string;
  public static hasData: boolean;
  files: Entry[];

  constructor(public navCtrl: NavController, private platform: Platform) {
    this.platform = platform;
    this.files = null;
    if (this.platform.is("android")) {
      this.fs = cordova.file.externalDataDirectory;
    } else if (this.platform.is("ios")) {
      this.fs = cordova.file.documentsDirectory;
    } else if (this.platform.is("windows")) {

    }

    File.listDir(this.fs, "strategy-saves").then((entries:Entry[]) => {
      this.files = entries;
    }).catch(err => {
      File.createDir(this.fs, "strategy-saves", false).then((freeSpace) => {
        console.log("Free space after dir: " + freeSpace);
      }).catch(err => {
        console.log(err.message);
      });
    });
  }

  ionViewDidEnter() {
    OpenFilePage.hasData = false;
  }

  openFile(event) {
    OpenFilePage.hasData = true;
    FieldPage.savedStrat = event.target.innerHTML;
    this.navCtrl.pop();
  }

}
