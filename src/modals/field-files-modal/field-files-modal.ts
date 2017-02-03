/**
 * Created by Kyle Flynn on 2/2/2017.
 */

import { Component } from '@angular/core';

import { ViewController } from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";
import { FileReader } from '../../util/file-manager';
import { LoggerLevel, DebugLogger } from "../../util/debug-logger";
import { FileEntry } from "ionic-native/dist/es5/index";

@Component({
  selector: 'page-field-modal',
  templateUrl: 'field-files-modal.html'
})
export class FieldFilesModal {

  connection: ConnectionManager;

  strategy_files: any;

  constructor(private viewCtrl: ViewController) {
    this.connection = new ConnectionManager();
    this.strategy_files = null;
  }
  
  ionViewWillEnter() {
    FileReader.getFiles("strategy-files").then((entries:FileEntry[]) => {
      this.strategy_files = entries;
      DebugLogger.log(LoggerLevel.INFO, this.strategy_files.length + " strategy files found.");
    }, (err) => {
      DebugLogger.log(LoggerLevel.ERROR, err.message + " Code " + err.code);
    });
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

}
