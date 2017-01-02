import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera } from 'ionic-native';

@Component({
  selector: 'page-camera-preview',
  templateUrl: 'camera-preview.html'
})
export class CameraPreviewPage {

  team: string;
  src: string;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.team = navParams.get("team");
    this.src = null;

    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: true,
      quality: 75,
      targetWidth: 640,
      targetHeight: 640
    }).then((imageData) => {
      this.src = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      this.src = null;
      console.log(err);
    });

  }

}
