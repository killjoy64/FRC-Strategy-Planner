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
  }

  ionViewWillLoad() {
    File.listDir(this.fs, "strategy-saves").then((entries:Entry[]) => {
      this.files = entries;
      console.log(this.files.length + " FILES FOUND IN SAVES DIRECTORY");
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

    let files = document.getElementsByClassName("file-item");

    for (let i = 0; i < files.length; i++) {
      files[i].setAttribute("id", "file-" + i);
      console.log("Assigning an ID: " + files[i].id);
    }

    console.log("Number of Entries: " + files.length);

  }

  openFile(event) {
    OpenFilePage.hasData = true;

    let files = document.getElementsByClassName("file-item");

    for (let i = 0; i < files.length; i++) {
      console.log("ID: " + files[i].id);
      let btn = document.getElementById(files[i].id);
      let txt = btn.getElementsByClassName("file")[0];
      console.log("INNER HTML: " + txt.innerHTML);

      let fileName = null;

      // Not sure why this is sometimes undefined
      if (event.target.getElementsByClassName("file")[0]) {
        fileName = event.target.getElementsByClassName("file")[0].innerHTML;
      } else {
        fileName = event.target.innerHTML;
      }

      console.log("TARGET ID: " + event.target.id + " | " + fileName);

      if (fileName == txt.innerHTML) {
        console.log("FOUND TARGET ID: " + fileName + " == " + txt.innerHTML);
        FieldPage.savedStrat = this.files[i];
        this.navCtrl.pop();
      }

      // console.log(files[i].innerHTML + " | " + event.target.innerHTML);
      // if (files[i].innerHTML == event.target.innerHTML) {
      //   console.log("Found: " + event.target.innerHTML);
      //   FieldPage.savedStrat = this.files[i];
      //   this.navCtrl.pop();
      // }
    }
  }

}
