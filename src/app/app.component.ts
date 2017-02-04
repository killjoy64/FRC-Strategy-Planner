import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { StartupPage } from '../pages/startup/startup';
import { LoggerLevel, DebugLogger } from "../util/debug-logger";
import { AppDirectory } from "../util/file-manager";
import { ConnectionManager } from '../util/connection-manager';
import { FirebaseService } from "../providers/firebase-provider";

@Component({
  templateUrl: 'app.html',
  providers: [FirebaseService]
})
export class FRCSP {

  private cm: ConnectionManager;

  rootPage = StartupPage;


  constructor(platform: Platform, fb: FirebaseService) {

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.cm = new ConnectionManager();

      DebugLogger.init();
      DebugLogger.log(LoggerLevel.INFO, "DebugLogger initialized.");

      this.cm.getConnection().then((connected) => {
        if (connected) {
          fb.init();
        } else {
          DebugLogger.log(LoggerLevel.WARN, "Could not connect to Firebase.");
        }
      });

      AppDirectory.init(platform);
    });

  }
}
