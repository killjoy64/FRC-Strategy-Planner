import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {AlertController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Rx";

@Injectable()
export class TBAService {

  data: any;

  constructor(public http: Http, private alertCtrl: AlertController) {
    console.log('Hello TBAService Provider');
  }

  reset() {
    this.data = null;
  }

  requestTeamInfo(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team, {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  // requestCompleteTeamInfo(team) {
  //   let authHeader = new Headers();
  //   authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
  //
  //   return Observable.forkJoin(
  //     this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team, {
  //       headers: authHeader
  //     }).map(response => response.json()),
  //
  //     this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team, {
  //       headers: authHeader
  //     }).map(response => response.json())
  //   );
  //
  //   return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team, {
  //     headers: authHeader
  //   }).map(response => response.json());
  // }

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
