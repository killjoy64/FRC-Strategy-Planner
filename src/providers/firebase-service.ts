import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class FirebaseService {

  public db: any;

  constructor() {
    console.log('Firebase Service Provider Initialized');
  }

  init() {
    const fbConf = {
      apiKey: "AIzaSyCMM7Z-RpsoJToWYuavO5wQkQIRQPTb6NY",
      authDomain: "frc-strategy-planner-b8904.firebaseapp.com",
      databaseURL: "https://frc-strategy-planner-b8904.firebaseio.com",
      storageBucket: "frc-strategy-planner-b8904.appspot.com"
    };

    firebase.initializeApp(fbConf);

    this.db = firebase.database().ref('/');

    console.log("Firebase successfully initialized");
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
