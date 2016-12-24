import { Component } from '@angular/core';
import { File } from 'ionic-native';
import { NavController } from 'ionic-angular';

declare var cordova: any;

@Component({
  selector: 'open-file',
  templateUrl: 'open-file.html'
})
export class OpenFilePage {

  fs:string;

  constructor(public navCtrl: NavController) {
    this.fs = cordova.file.dataDirectory;
    File.checkDir(this.fs, 'strategy-saves').then((bool) => {
      console.log('strategy-saves found' + " | BOOLEAN VALUE: " + bool)
    }).catch(err => {
      File.createDir(this.fs, "strategy-saves", false).then((freeSpace) => {
        console.log("Free space after dir: " + freeSpace)
      });
    });
  }

}
