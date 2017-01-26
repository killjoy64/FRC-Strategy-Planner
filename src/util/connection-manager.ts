/**
 * Created by Kyle Flynn on 1/25/2017.
 */

import { Network } from 'ionic-native';

export class ConnectionManager {

  // Amount of time before the connection should timeout
  timeout: number;

  constructor() {
    this.timeout = 5;
  }

  // Sets the new value for the connection timeout.
  setTimeout(new_timeout) {
    this.timeout = new_timeout;
  }

  // Simple method that checks if a connection is available.
  isConnectionAvailable() {
    return Network.type != "none";
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
