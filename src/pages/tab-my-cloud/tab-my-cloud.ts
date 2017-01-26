/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";

@Component({
  selector: 'page-my-cloud',
  templateUrl: 'tab-my-cloud.html'
})
export class CloudPage {

  connection: ConnectionManager;

  constructor(public navCtrl: NavController) {
    this.connection = new ConnectionManager();
  }

}
