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

  requestTeamEvents(team, year) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/" + year + "/events", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamEventAwards(team, event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/event/" + event + "/awards", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamEventMatches(team, event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/event/" + event + "/matches", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamYears(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/years_participated", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamEventHistory(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/events", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamAwardHistory(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/awards", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamRobotHistory(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/robots", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamDistrictHistory(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/districts", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestCompleteTeamInfo(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return Observable.forkJoin(
      this.requestTeamInfo(team),
      this.requestTeamYears(team),
      this.requestTeamRobotHistory(team),
      this.requestTeamEventHistory(team),
      this.requestTeamAwardHistory(team),
      this.requestTeamEventHistory(team)
    );
  }

}
