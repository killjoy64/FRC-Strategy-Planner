import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {AlertController} from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class TBAService {

  data: any;

  constructor(public http: Http, private alertCtrl: AlertController) {
    console.log('Hello TBAService Provider');
  }

  reset() {
    this.data = null;
  }

  sendRequest(url) {

    if (this.data) {
      console.log("HERE IT IS ALREADY DONE");
      return Promise.resolve(this.data);
    }

    let authHeader = new Headers();

    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return new Promise(resolve => {
      this.http.get("https://www.thebluealliance.com/api/v2/" + url, {
        headers: authHeader
      })
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, error => {
        });
    });

  }

}
