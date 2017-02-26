/**
 * Created by Kyle Flynn on 1/25/2017.
 */

import { LoadingController, Loading, AlertController } from 'ionic-angular';
import { Network } from 'ionic-native';
import { TBAService } from "../providers/tba-provider";

export class ConnectionManager {

  // Amount of time before the connection should timeout
  timeout: number;

  // Define the loading controller. We may not need it in some cases, so it's not in the constructor.
  loadCtrl: LoadingController;

  // Define the alert controller. We may not need it in some cases, so it's not in the constructor.
  alertCtrl: AlertController;

  // Define the request service. We may not need it in some cases, so it's not in the constructor.
  tba: TBAService;

  curLoad: Loading;

  // Maintains the current timeout ID.
  timeoutID: number;

  constructor() {
    this.timeout = 7;

    this.loadCtrl = null;
    this.alertCtrl = null;
    this.curLoad = null;
    this.timeoutID = null;
  }

  // Method to set the loading controller if we ever need it.
  setLoadController(loadingController: LoadingController) {
    this.loadCtrl = loadingController;
  }

  // Method to set the alert controller if we ever need it.
  setAlertController(alertController: AlertController) {
    this.alertCtrl = alertController;
  }

  // Method to set the request service if we ever need it.
  setRequestService(tbaService: TBAService) {
    this.tba = tbaService;
  }

  // Sets the new value for the connection timeout.
  setTimeout(new_timeout) {
    this.timeout = new_timeout;
  }

  // Simple method that checks if a connection is available.
  isConnectionAvailable() {
    return Network.type != "none";
  }

  showLoader(msg, duration) {
    // TODO - Check if current connection is available....
    if (this.loadCtrl) {
      this.curLoad = this.loadCtrl.create({
        content: msg,
      });

      this.timeoutID = setTimeout(() => {
        clearTimeout(this.timeoutID);
        this.timeoutID = null;
        this.curLoad.dismiss().then(() => {
          if (this.tba) {
            this.tba.cancelRequest();
          }
          if (this.alertCtrl) {
            this.showAlert("Error", "Connection timed out. Are you connected to the internet?");
          }
        });
      }, duration);

      return this.curLoad.present();

    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    }
  }

  hideLoader() {
    if (this.loadCtrl && this.timeoutID) {
      clearTimeout(this.timeoutID);
      if (this.tba) {
        this.tba.cancelRequest();
      }
      return this.curLoad.dismiss();
    }
  }

  showAlert(title, msg) {
    if (this.alertCtrl) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  // Returns a Promise<boolean> as to whether or not there is a successful connection.
  getConnection() {
    return new Promise((resolve) => {

        // If there is already a connection, resolve the promise.
        if (this.isConnectionAvailable()) {
          resolve(true);
        } else {

          // Variable that decides how often to check for a connection.
          let interval = 100;

          // Variable that gets the amount of time we've been searching for a connection.
          let time = 0.0;

          // Check for a connection every 100ms. Resolve if a connection happens. Resolve if time exceeds timeout.
          let timeout = setInterval(() => {

            if (this.isConnectionAvailable()) {
              resolve(true);
              clearInterval(timeout);
            }

            if (time >= this.timeout) {
              resolve(false);
              clearInterval(timeout);
            } else {
              time += interval/1000;
            }

          }, interval);

        }
    });
  }

}
