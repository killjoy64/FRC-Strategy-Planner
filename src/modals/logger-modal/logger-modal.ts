import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";
import {DebugLogger } from '../../util/debug-logger';

@Component({
  selector: 'logger-modal',
  templateUrl: 'logger-modal.html'
})
export class LoggerModal {

  logs: any;

  constructor(private viewCtrl: ViewController) {
    this.logs = DebugLogger.getLogs().split("<br/>");
  }

  closeModal() {
    this.viewCtrl.dismiss();

  }

}
