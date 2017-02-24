import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx";
import { DebugLogger, LoggerLevel } from '../util/debug-logger';

@Injectable()
export class TBAService {

  currentURL: string;

  constructor(public http: Http, private alertCtrl: AlertController) {
    this.currentURL = null;

    DebugLogger.log(LoggerLevel.INFO, 'TBA Service Provider Initialized');
  }

  // TODO - Rework all AJAX methods to comply...
  // cancelRequest() {
  //   if (this.currentURL) {
  //     let authHeader = new Headers();
  //     authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
  //     this.http.get(this.currentURL).unsubscribe();
  //   }
  // }

  /* START TEAM SPECIFIC AJAX REQUESTS */
  requestTeamInfo(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/team/frc" + team;
    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team, {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamEvents(team, year) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/team/frc" + team + "/" + year + "/events";
    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/" + year + "/events", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamEventAwards(team, event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/team/frc" + team + "/event/" + event + "/awards";
    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/event/" + event + "/awards", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamEventMatches(team, event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/team/frc" + team + "/event/" + event + "/matches";
    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/event/" + event + "/matches", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamYears(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/team/frc" + team + "/years_participated";
    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/years_participated", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamEventHistory(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/events";
    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/events", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamAwardHistory(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/awards";
    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/awards", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamRobotHistory(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/robots";
    return this.http.get("https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/robots", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestTeamDistrictHistory(team) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/team/frc" + team + "/history/districts";
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
      this.requestTeamAwardHistory(team)
    );
  }

  /* END TEAM SPECIFIC AJAX REQUESTS */

  /* START EVENT SPECIFIC AJAX REQUESTS */

  requestEventList(year) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/events/" + year;
    return this.http.get("https://www.thebluealliance.com/api/v2/events/" + year, {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestEvent(event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/event/" + event;
    return this.http.get("https://www.thebluealliance.com/api/v2/event/" + event, {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestEventTeamList(event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/event/" + event + "/teams";
    return this.http.get("https://www.thebluealliance.com/api/v2/event/" + event + "/teams", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestEventMatchList(event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/event/" + event + "/matches";
    return this.http.get("https://www.thebluealliance.com/api/v2/event/" + event + "/matches", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestEventStatistics(event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/event/" + event + "/stats";
    return this.http.get("https://www.thebluealliance.com/api/v2/event/" + event + "/stats", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestEventRankings(event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/event/" + event + "/rankings";
    return this.http.get("https://www.thebluealliance.com/api/v2/event/" + event + "/rankings", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestEventAwards(event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/event/" + event + "/awards";
    return this.http.get("https://www.thebluealliance.com/api/v2/event/" + event + "/awards", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestEventPoints(event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/event/" + event + "/district_points";
    return this.http.get("https://www.thebluealliance.com/api/v2/event/" + event + "/district_points", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestCompleteEventInfo(event) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');

    return Observable.forkJoin(
      this.requestEvent(event),
      this.requestEventTeamList(event),
      this.requestEventMatchList(event),
      this.requestEventStatistics(event),
      this.requestEventRankings(event),
      this.requestEventAwards(event),
      this.requestEventPoints(event)
    );
  }

  /* END EVENT SPECIFIC AJAX REQUESTS */

  /* START DISTRICT SPECIFIC AJAX REQUESTS */

  requestDistricts(year) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/districts/" + year;
    return this.http.get("https://www.thebluealliance.com/api/v2/districts/" + year, {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  requestDistrictEvents(year, district) {
    let authHeader = new Headers();
    authHeader.append('X-TBA-App-Id', 'admin:frcsp:v01');
    this.currentURL = "https://www.thebluealliance.com/api/v2/district/" + district + "/" + year + "/events";
    return this.http.get("https://www.thebluealliance.com/api/v2/district/" + district + "/" + year + "/events", {
      headers: authHeader
    }).map((response:Response) => response.json());
  }

  /* END DISTRICT SPECIFIC AJAX REQUESTS */

}
