/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Style } from "../../util/style";
import { TBAService } from "../../providers/tba-provider";
import { DebugLogger, LoggerLevel } from "../../util/debug-logger";
import { ConnectionManager } from "../../util/connection-manager";
import { TeamPage } from "../team/team";
import { EventPage } from "../event/event";
import { Config } from "../../util/config";

@Component({
  selector: 'page-teams-events',
  templateUrl: 'tab-teams-events.html',
  providers: [TBAService]
})
export class TeamsAndEventsPage {

  connection: ConnectionManager;

  team_number: any;

  event_year: any;
  event_district: any;
  event_key: any;

  districts: any;
  events: any;

  loading_districts: boolean;
  loading_events: boolean;

  constructor(private navCtrl: NavController, private tba: TBAService, private alertCtrl: AlertController, private loadCtrl: LoadingController) {
    this.connection = new ConnectionManager();
    this.connection.setAlertController(this.alertCtrl);
    this.connection.setLoadController(this.loadCtrl);

    this.team_number = null;

    this.event_year = null;
    this.event_district = null;
    this.event_key = null;

    this.districts = null;
    this.events = null;

    this.loading_districts = false;
    this.loading_events = false;

    if (!Config.IS_BROWSER) {
      window.addEventListener('native.keyboardshow', () => {
        document.body.classList.add("keyboard-is-open");
      });

      window.addEventListener('native.keyboardhide', () => {
        document.body.classList.remove("keyboard-is-open");
      });
    }
  }

  testMe() {
    console.log("testing");
  }

  showTeams() {
    document.getElementById("teams_search").style.display = "block";
    Style.translateY("events", 100).then(() => {
      Style.fadeInOp("teams_search");
    });
  }

  showEvents() {
    document.getElementById("events_search").style.display = "block";
    Style.translateY("teams", -100).then(() => {
      Style.fadeInOp("events_search");
    });
  }

  resetTeamView() {
    Style.fadeOutOp("events_search").then(() => {
      document.getElementById("events_search").style.display = "none";
    });
    Style.translateY("teams", 0);
  }

  resetEventView() {
    Style.fadeOutOp("teams_search").then(() => {
      document.getElementById("teams_search").style.display = "none";
    });
    Style.translateY("events", 0);
  }

  getDistricts() {
    if (this.event_year) {
      this.loading_districts = true;
      this.tba.requestDistricts(this.event_year).subscribe( (data) => {
        this.districts = data;
        this.event_district = null;
        this.loading_districts = false;
      }, (err) => {
        DebugLogger.log(LoggerLevel.ERROR, "Did not find any districts in that year.");
      });
    }
  }

  getDistrictEvents() {
    if (this.event_year && this.event_district) {
      this.loading_events = true;
      this.tba.requestDistrictEvents(this.event_year, this.event_district).subscribe( (data) => {
        this.events = data;
        this.event_key = null;
        this.loading_events = false;
      }, (err) => {
        DebugLogger.log(LoggerLevel.ERROR, "Did not find any events for that year, or district.");
      });
    }
  }

  openEventPage() {
    if (this.event_year && this.event_district && this.event_key) {
      DebugLogger.log(LoggerLevel.INFO, "Getting event " + this.event_key);
      this.connection.showLoader("Searching...", 7000);
      this.tba.requestCompleteEventInfo(this.event_key).subscribe((data) => {
        this.connection.hideLoader();

        let eventInfo = data[0];
        eventInfo.teams = data[1];
        eventInfo.matches = data[2];
        eventInfo.stats = data[3];
        eventInfo.ranks = data[4];
        eventInfo.awards = data[5];
        eventInfo.points = data[6];

        this.navCtrl.push(EventPage, {
          year: this.event_year,
          district: this.event_district,
          key: this.event_key,
          events: eventInfo
        });
      }, (err) => {
        this.connection.hideLoader().then(() => {
          this.connection.showAlert("Error", "Could not find an FRC event of those credentials.");
        });
        DebugLogger.log(LoggerLevel.ERROR, "Could not find event " + this.event_key);
      });
      return;
    }
    if (this.event_year && this.event_district) {
      DebugLogger.log(LoggerLevel.INFO, "Getting events for year " + this.event_year + " and district " + this.event_district);
      this.connection.showLoader("Searching...", 7000);
      this.tba.requestDistrictEvents(this.event_year, this.event_district).subscribe((data) => {
        this.connection.hideLoader();

        this.navCtrl.push(EventPage, {
          year: this.event_year,
          district: this.event_district,
          key: this.event_key,
          events: data
        });
      }, (err) => {
        this.connection.hideLoader().then(() => {
          this.connection.showAlert("Error", "Could not find any FRC events of those credentials.");
        });
        DebugLogger.log(LoggerLevel.ERROR, "Could not find events under " + this.event_year + " and district " + this.event_district);
      });
      return;
    }
    if (this.event_year) {
      DebugLogger.log(LoggerLevel.INFO, "Getting events for year " + this.event_year);
      this.connection.showLoader("Searching...", 7000);
      this.tba.requestEventList(this.event_year).subscribe((data) => {
        this.connection.hideLoader();

        this.navCtrl.push(EventPage, {
          year: this.event_year,
          district: this.event_district,
          key: this.event_key,
          events: data
        });
      }, (err) => {
        this.connection.hideLoader().then(() => {
          this.connection.showAlert("Error", "Could not find any FRC events of those credentials.");
        });
        DebugLogger.log(LoggerLevel.ERROR, "Could not find events under " + this.event_year);
      });
      return;
    }
  }

  openTeamPage() {
    if (this.team_number) {
      this.connection.showLoader("Searching...", 6000);
      this.tba.requestCompleteTeamInfo(this.team_number).subscribe((data) => {
        this.connection.hideLoader();

        let teamInfo = data[0];
        teamInfo.years = data[1].length;
        teamInfo.robots = data[2];
        teamInfo.events = data[3];
        teamInfo.awards = data[4];

        this.navCtrl.push(TeamPage, {
          team: teamInfo
        });
      }, (err) => {
        this.connection.hideLoader().then(() => {
          this.connection.showAlert("Error", "Did not find an FRC team by that number.");
        });
      });
    }
  }

}
