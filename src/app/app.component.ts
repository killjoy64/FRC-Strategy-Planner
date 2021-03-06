import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { LoginPage } from '../pages/login/login';
import { AppDirectory } from '../util/file-reader';
import { Config } from '../util/config';
import { FirebaseService } from "../providers/firebase-service";
import { DebugLogger, LoggerLevel } from '../util/debug-logger';

@Component({
  templateUrl: 'app.html',
  providers: [FirebaseService]
})
export class FRCSP {
  rootPage = LoginPage;

  constructor(platform: Platform, fb: FirebaseService) {

    // TODO - Check if internet connection exists, otherwise don't initialize.
    fb.init();

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();

      DebugLogger.init();

      DebugLogger.log(LoggerLevel.INFO, "BROWSER CONFIGURATION: " + Config.IS_BROWSER);

      if (!Config.IS_BROWSER) {
        AppDirectory.init(platform);
        AppDirectory.createDirs();
        AppDirectory.checkConfig();
      }

      setTimeout(function () {
        document.getElementById("login-logo").classList.add("slid-up");
        document.getElementById("pre-loader").classList.add("fadeOut");
        document.getElementById("pre-loader").addEventListener("transitionend", function() {
          document.getElementById("login-credentials").classList.remove("hidden");
          document.getElementById("login-credentials").classList.add("fadeIn");
        });
        document.getElementById("login-btn").addEventListener("touchstart", function() {
        });
        document.getElementById("offline-btn").addEventListener("touchstart", function() {
          // TODO - Verify account information
        });
      }, 1000);

    });
  }
}
