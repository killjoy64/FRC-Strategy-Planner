/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";
import {Style} from "../../util/style";

@Component({
  selector: 'page-teams-events',
  templateUrl: 'tab-teams-events.html'
})
export class TeamsAndEventsPage {

  connection: ConnectionManager;

  constructor(public navCtrl: NavController) {
    this.connection = new ConnectionManager();
  }

}
