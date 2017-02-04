/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";
import {DebugLogger} from "../../util/debug-logger";

@Component({
  selector: 'page-logger-modal',
  templateUrl: 'settings-logger-modal.html'
})
export class LoggerModal {

  logs: any;

  constructor(private viewCtrl: ViewController) {
    this.logs = DebugLogger.getLogs().split("<br/>");;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
