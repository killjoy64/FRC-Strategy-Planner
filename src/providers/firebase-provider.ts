/**
 * Created by Kyle Flynn on 1/25/2017.
 */

import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { DebugLogger, LoggerLevel } from '../util/debug-logger';

@Injectable()
export class FirebaseService {

  public db: any;

  constructor() {
    DebugLogger.log(LoggerLevel.INFO, 'Firebase Service Provider Initialized');
  }

  init() {
    const fbConf = {
      apiKey: "AIzaSyCMM7Z-RpsoJToWYuavO5wQkQIRQPTb6NY",
      authDomain: "frc-strategy-planner-b8904.firebaseapp.com",
      databaseURL: "https://frc-strategy-planner-b8904.firebaseio.com",
      storageBucket: "frc-strategy-planner-b8904.appspot.com"
    };

    firebase.initializeApp(fbConf);

    this.db = firebase.database();

    DebugLogger.log(LoggerLevel.INFO, "Firebase successfully initialized");
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then((user: firebase.User) => {
        resolve(user);
      }).catch((error) => {
        reject(error);
      });
    });
  }

}
