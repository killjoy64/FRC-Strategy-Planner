import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { StartupPage } from '../pages/startup/startup';

@Component({
  templateUrl: 'app.html'
})
export class FRCSP {
  rootPage = StartupPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
