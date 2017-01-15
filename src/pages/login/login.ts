import { Component } from '@angular/core';
import { TabsPage } from '../tab-directory/tab-directory';
import { NavController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [FirebaseService]
})
export class LoginPage {

  email: string;
  password: string;

  constructor(public navCtrl: NavController, private fb: FirebaseService) {}

  login(offlineMode) {
    if (!offlineMode) {
      if (this.email.length > 0 && this.password.length > 0) {
        console.log("Logging in!");
        this.fb.login(this.email, this.password).then((user) => {
          console.log(user);
          this.navCtrl.push(TabsPage, {}, {duration:750});
          // TODO - Do some configuration stuff so that the user can upload data. (Edit settings page)
        }, (err) => {
          console.log(err);
          // Add error display
        });
      }
    } else {
      console.log("Offline mode!");
      this.navCtrl.push(TabsPage, {}, {duration:750});
    }
  }

}
