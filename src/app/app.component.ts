import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { StartupPage } from '../pages/startup/startup';
import { LoggerLevel, DebugLogger } from "../util/debug-logger";
import { AppDirectory } from "../util/file-manager";

@Component({
  templateUrl: 'app.html'
})
export class FRCSP {
  rootPage = StartupPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();

      DebugLogger.init();
      DebugLogger.log(LoggerLevel.INFO, "DebugLogger initialized.");

      AppDirectory.init(platform);

    });
  }
}
