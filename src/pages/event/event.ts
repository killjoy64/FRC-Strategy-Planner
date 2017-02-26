/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController, AlertController, Refresher} from 'ionic-angular';
import { TeamSorter, MatchSorter } from "../../util/object-sorter";
import { EventTeamPage } from "../event-team/event-team";
import { TeamSearcher } from "../../util/object-searcher";
import { MatchConverter } from "../../util/string-converter";
import { Config } from "../../util/config";
import {FileWriter, FileGetter, AppDirectory} from "../../util/file-manager";
import { LoggerLevel, DebugLogger } from "../../util/debug-logger";
import { ConnectionManager } from "../../util/connection-manager";
import { TBAService } from "../../providers/tba-provider";
import {MatchFilter, TeamFilter} from "../../util/object-filter";

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
  providers: [TBAService]
})
export class EventPage {

  favorite_event: boolean;

  connection: ConnectionManager;

  match_sorter: MatchSorter;
  match_converter: MatchConverter;
  match_filter: MatchFilter;

  team_sorter: TeamSorter;
  team_searcher: TeamSearcher;
  team_filter: TeamFilter;

  event: any;
  rankings: any;
  rankings_labels: any;

  show_rankings: boolean;

  view: any;

  constructor(private navCtrl: NavController, private navParams: NavParams, private loadCtrl: LoadingController, private toastCtrl: ToastController, private alertCtrl: AlertController, private tba: TBAService) {
    this.connection = new ConnectionManager();
    this.connection.setAlertController(this.alertCtrl);
    this.connection.setLoadController(this.loadCtrl);
    this.connection.setRequestService(this.tba);

    this.match_sorter = new MatchSorter();
    this.match_converter = new MatchConverter();
    this.team_sorter = new TeamSorter();
    this.team_searcher = new TeamSearcher();

    this.favorite_event = false;

    this.rankings = [];
    this.rankings_labels = null;

    this.view = null;

    this.show_rankings = false;

    if (this.navParams.get("event")) {
      this.event = this.navParams.get("event");
    } else {
      this.event = null;
    }

    if (this.navParams.get("favorited")) {
      this.favorite_event = this.navParams.get("favorited");
    }

    this.repopulateRankings();
  }

  ionViewWillEnter() {
    this.showStats();
    this.match_sorter.sort(this.event.matches, 0, this.event.matches.length - 1);
    this.team_sorter.sort(this.event.teams, 0, this.event.teams.length - 1);

    this.match_filter = new MatchFilter(this.event.matches);
    this.team_filter = new TeamFilter(this.event.teams);

    if (this.favorite_event && Config.AUTO_SAVE_EVENT) {
      this.saveEvent().then((file) => {
        this.showToast("Saved event " + this.event.key + ".json");
      }).catch((err) => {
        this.showToast(err.message);
      });
    }
  }

  favoriteEvent() {
    if (!this.favorite_event || !Config.AUTO_SAVE_EVENT) {
      this.favorite_event = true;
      this.saveEvent().then((file) => {
        this.showToast("Saved event " + this.event.key + ".json");
      }).catch((err) => {
        this.showToast(err.message);
      });
    }
  }

  saveEvent() {
    return new Promise((resolve, reject) => {
      FileWriter.writePermFile("events", this.event.key + ".json", JSON.stringify(this.event)).then((file) => {
        DebugLogger.log(LoggerLevel.INFO, "Saved event " + file.name);
        resolve(file);
      }).catch((err) => {
        DebugLogger.log(LoggerLevel.ERROR, this.event.key + ".json: " + err.message + " Code " + err.code);
        reject(err);
      });
    });
  }

  refreshEvent(e: Refresher) {
    if (this.connection.isConnectionAvailable() || Config.IS_BROWSER) {
      DebugLogger.log(LoggerLevel.INFO, "Getting event " + this.event.key);

      let timeout = setTimeout(() => {
        if (e.state != "completing") {
          this.tba.cancelRequest();
          e.cancel();
        }
      }, 7000);

      this.tba.requestCompleteEventInfo(this.event.key).then((data) => {

        let eventInfo = data[0];
        eventInfo.teams = data[1];
        eventInfo.matches = data[2];
        eventInfo.stats = data[3];
        eventInfo.ranks = data[4];
        eventInfo.awards = data[5];
        eventInfo.points = data[6];

        for (let i = 0; i < eventInfo.teams; i++) {
          let teamInfo = eventInfo.teams[i];

          FileGetter.read("robots", teamInfo.team_number + ".jpg").then((data) => {
            teamInfo.photo_url = AppDirectory.getPermDir() + "robots/" + teamInfo.team_number + ".jpg";
            DebugLogger.log(LoggerLevel.INFO, "Found robot photo for team " + teamInfo.team_number);
          }, (err) => {});

          FileGetter.read("pit-scouting", teamInfo.team_number + ".json").then((data:string) => {
            teamInfo.pit_info = JSON.parse(data);
            DebugLogger.log(LoggerLevel.INFO, "Found pit scouting file for team " + teamInfo.team_number);
          }, (err) => {});
        }

        this.match_sorter.sort(eventInfo.matches, 0, eventInfo.matches.length - 1);
        this.team_sorter.sort(eventInfo.teams, 0, eventInfo.teams.length - 1);

        this.event = eventInfo;

        if (this.favorite_event && Config.AUTO_SAVE_EVENT && !Config.IS_BROWSER) {
          this.saveEvent().then((file) => {
            DebugLogger.log(LoggerLevel.INFO, "Refreshed & autosaved event " + this.event.key);
          }).catch((err) => {
            DebugLogger.log(LoggerLevel.INFO, "Error autosaving event " + this.event.key);
          });
        } else {
          DebugLogger.log(LoggerLevel.INFO, "Refreshed event " + this.event.key);
        }
        e.complete();
        clearTimeout(timeout);
      }, (err) => {
        DebugLogger.log(LoggerLevel.ERROR, "Could not find event " + this.event.key);
      });
    } else {
      e.cancel();
    }
  }

  openEventTeamPage(team) {
    let loader = this.loadCtrl.create({
      content: "Loading Data...",
      duration: 3000
    });
    loader.present();

    let matches = [];

    for (let match of this.event.matches) {
      for (let i = 0; i < 3; i++) {
        if (match.alliances.blue.teams[i] == team.key) {
          matches.push(match);
        }
        if (match.alliances.red.teams[i] == team.key) {
          matches.push(match);
        }
      }
    }

    team.matches = matches;

    if (this.rankings.length > 0 ) {

      let rank_info = null;

      for (let i = 0; i < this.rankings.length; i++) {
        let goal = parseInt(team.team_number);
        let curr = parseInt(this.rankings[i].team);

        if (curr == goal) {
          rank_info = this.rankings[i];
          break;
        }
      }

      team.rank = rank_info;
      team.rank_info = this.rankings_labels;
    }

    this.navCtrl.push(EventTeamPage, {
      event: this.event.short_name,
      team: team
    }).then(() => {
      loader.dismiss();
    });
  }

  getTeamAndOpen(team_number) {
    let team = this.team_searcher.search(this.event.teams, team_number, 0, this.event.teams.length - 1);
    this.openEventTeamPage(team);
  }

  showStats() {
    this.toggleButton("stats-btn");
    this.view = 'stats';
  }

  showTeams() {
    this.toggleButton("teams-btn");
    this.view = 'teams';
  }

  showAwards() {
    this.toggleButton("award-btn");
    this.view = 'awards';
  }

  showMatches() {
    this.toggleButton("matches-btn");
    this.view = 'matches';
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 1500,
      position: 'bottom',
    });
    return toast.present();
  }

  private repopulateRankings() {

    if (this.event.ranks.length > 0) {
      let label = this.event.ranks[0];
      this.rankings_labels = {
        rank_label: label[0],
        team_label: label[1],
        ranking_score_label: label[2],
        auto_label: label[3],
        scale_challenge_label: label[4],
        goals_label: label[5],
        defense_label: label[6],
        record_label: label[7],
        played_label: label[8]
      };

      for (let i = 1; i < this.event.ranks.length; i++) {
        let ranking = this.event.ranks[i];

        this.rankings.push({
          rank: ranking[0],
          team: ranking[1],
          ranking_score: ranking[2],
          auto: ranking[3],
          scale_challenge: ranking[4],
          goals: ranking[5],
          defense: ranking[6],
          record: ranking[7],
          played: ranking[8]
        });
      }
    }

  }

  private clearActiveButtons() {
    let buttons = document.getElementsByClassName("profile-button");

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active-button");
    }
  }

  private toggleButton(id) {
    let btn = document.getElementById(id);
    if (btn.classList.contains("active-button")) {
      this.clearActiveButtons();
      return false;
    } else {
      this.clearActiveButtons();
      btn.classList.add("active-button");
      return true;
    }
  }

}
