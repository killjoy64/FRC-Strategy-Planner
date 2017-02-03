/**
 * Created by Kyle Flynn on 2/2/2017.
 */

import { Component } from '@angular/core';

import { ViewController } from 'ionic-angular';
import { FileGetter } from '../../util/file-manager';
import { LoggerLevel, DebugLogger } from "../../util/debug-logger";
import { FileEntry, Metadata } from "ionic-native/dist/es5/index";

@Component({
  selector: 'page-field-modal',
  templateUrl: 'field-files-modal.html'
})
export class FieldFilesModal {

  strategy_files: any;
  strategy_file: any;

  constructor(private viewCtrl: ViewController) {
    this.getFiles();
  }

  ionViewWillEnter() {
    console.log("load");
    this.strategy_file = null;
  }

  getFiles() {
    FileGetter.getFiles("strategy-files").then((entries:FileEntry[]) => {
      this.strategy_files = entries;
      for (let i = 0; i < entries.length; i++) {
        entries[i].getMetadata((metadata:Metadata) => {
          this.strategy_files[i].size = metadata.size;
          this.strategy_files[i].modificationTime = metadata.modificationTime;
          console.log(this.strategy_files[i]);
        }, (err) => {
          DebugLogger.log(LoggerLevel.ERROR, this.strategy_files[i] + " error getting metadata. " + err.message);
        });
      }
      DebugLogger.log(LoggerLevel.INFO, this.strategy_files.length + " strategy files found.");
    }, (err) => {
      this.strategy_files = [{
        name: "file_1.strat",
        fullPath: "file:///storage/emulated/0/Android/data/tech.kyleflynn.frcsp/files/strategy-files/file_1.strat",
        modificationTime: new Date("October 13, 2014 11:13:00"),
        size: 4096000
      }, {
        name: "testing.strat",
        fullPath: "file:///storage/emulated/0/Android/data/tech.kyleflynn.frcsp/files/strategy-files/testing.strat",
        modificationTime: new Date("January 30, 2017 20:45:40"),
        size: 2046000
      }];
      DebugLogger.log(LoggerLevel.ERROR, err.message + " Code " + err.code);
    });
  }

  selectAndDismiss(fileEntry) {
    this.strategy_file = fileEntry;
    this.dismiss();
  }

  dismiss() {
    let data = { 'file': this.strategy_file };
    this.viewCtrl.dismiss(data);
  }

}
