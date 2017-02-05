/**
 * Created by Kyle Flynn on 1/25/2017.
 */

import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { DebugLogger, LoggerLevel } from '../util/debug-logger';
import { Config } from "../util/config";

@Injectable()
export class FirebaseService {

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

    DebugLogger.log(LoggerLevel.INFO, "Firebase successfully initialized");
  }

  createTeamAccount(name, email, team, uid) {
    if (firebase.apps.length < 1) {
      this.init();
    }
    return firebase.database().ref('teams/' + team + '/users/' + uid).set({
      name: name,
      email: email,
      authenticated: false,
      role : 'member'
    });
  }

  createUser(email, password, team) {
    return new Promise((resolve, reject) => {
      if (firebase.apps.length < 1) {
        this.init();
      }
      firebase.auth().createUserWithEmailAndPassword(email, password).then((user: firebase.User) => {
        Config.FIREBASE_USER = user;
        firebase.database().ref('users/' + user.uid).set({
          team: team
        }).then(() => {
          resolve(user);
        }, (err) => {
          reject(err);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      if (firebase.apps.length < 1) {
        this.init();
      }
      firebase.auth().signInWithEmailAndPassword(email, password).then((user: firebase.User) => {
        Config.FIREBASE_USER = user;
        resolve(user);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  resetPassword(email) {
    return new Promise((resolve, reject) => {
      if (firebase.apps.length < 1) {
        this.init();
      }
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  isAuthorized(uid) {
    let ref = firebase.database().ref("users/" + uid);
    ref.once("value").then((snapshot) => {
        // var a = snapshot.exists();  // true
      if (snapshot.exists()) {
       console.log(snapshot.val());
      }
    });
  }

}
