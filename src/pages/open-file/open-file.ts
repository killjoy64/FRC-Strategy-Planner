import { Component } from '@angular/core';
import { File } from 'ionic-native';
import { NavController } from 'ionic-angular';

declare var cordova: any;
// const fs:string = cordova.file.dataDirectory;

@Component({
  selector: 'open-file',
  templateUrl: 'open-file.html'
})
export class OpenFilePage {

  constructor(public navCtrl: NavController) {
    // console.log(fs);
  }

}
