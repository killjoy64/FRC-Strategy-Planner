/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';
import { NavParams, LoadingController, AlertController, NavController } from "ionic-angular";
import { TBAService } from "../../providers/tba-provider";
import { ConnectionManager } from "../../util/connection-manager";
import { EventPage } from "../event/event";
import { DebugLogger, LoggerLevel } from "../../util/debug-logger";
import { EventSorter } from "../../util/object-sorter";

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
  providers: [TBAService]
})
export class EventsPage {

  connection: ConnectionManager;

  event_sorter: EventSorter;

  events_year: any;
  events_district: any;

  events: any;

  constructor(private navCtrl: NavController, private loadCtrl: LoadingController, private alertCtrl: AlertController, private navParams: NavParams, private tba: TBAService) {
    this.connection = new ConnectionManager();
    this.connection.setLoadController(this.loadCtrl);
    this.connection.setAlertController(this.alertCtrl);

    this.event_sorter = new EventSorter();

    if (this.navParams.get("district")) {
      this.events_district = this.navParams.get("district");
    } else {
      this.events_district = null;
    }

    if (this.navParams.get("year")) {
      this.events_year = this.navParams.get("year");
    } else {
      this.events_year = null;
    }

    if (this.navParams.get("events")) {
      this.events = this.navParams.get("events");
    } else {
      this.events = null;
    }

    if (this.events) {
      this.event_sorter.sort(this.events, 0, this.events.length - 1);
    }

  }

  openEventPage(e_key) {
    this.connection.showLoader("Reaching Database...", 10000);
    this.tba.requestCompleteEventInfo(e_key).subscribe((data) => {
      let eventInfo = data[0];
      eventInfo.teams = data[1];
      eventInfo.matches = data[2];
      eventInfo.stats = data[3];
      eventInfo.ranks = data[4];
      eventInfo.awards = data[5];
      eventInfo.points = data[6];

      this.connection.hideLoader();

      this.navCtrl.push(EventPage, {
        event: eventInfo
      });
    }, (err) => {
      this.connection.hideLoader().then(() => {
        this.connection.showAlert("Error", "Could not complete request. " + err);
      });
    });
  }

}
