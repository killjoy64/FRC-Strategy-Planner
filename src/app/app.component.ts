import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class FRCSP {
  rootPage = LoginPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();

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