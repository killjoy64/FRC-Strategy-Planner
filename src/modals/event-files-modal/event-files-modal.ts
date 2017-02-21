/**
 * Created by Kyle Flynn on 2/2/2017.
 */

import { Component } from '@angular/core';

import { ViewController } from 'ionic-angular';
import { FileGetter } from '../../util/file-manager';
import { LoggerLevel, DebugLogger } from "../../util/debug-logger";
import { FileEntry, Metadata } from "ionic-native/dist/es5/index";

@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-files-modal.html'
})
export class EventFilesModal {

  event_files: any;
  event: any;

  constructor(private viewCtrl: ViewController) {
    this.getFiles();
  }

  ionViewWillEnter() {
    this.event = null;
  }

  getFiles() {
    FileGetter.getFiles("events").then((entries:FileEntry[]) => {
      this.event_files = entries;
      for (let i = 0; i < entries.length; i++) {
        entries[i].getMetadata((metadata:Metadata) => {
          this.event_files[i].size = metadata.size;
          this.event_files[i].modificationTime = metadata.modificationTime;
          console.log(this.event_files[i]);
        }, (err) => {
          DebugLogger.log(LoggerLevel.ERROR, this.event_files[i] + " error getting metadata. " + err.message);
        });
      }
      DebugLogger.log(LoggerLevel.INFO, this.event_files.length + " event files found.");
    }, (err) => {
      this.event_files = [{
        name: "file_1.json",
        fullPath: "file:///storage/emulated/0/Android/data/tech.kyleflynn.frcsp/files/events/file_1.strat",
        modificationTime: new Date("October 13, 2014 11:13:00"),
        size: 4096000
      }, {
        name: "testing.json",
        fullPath: "file:///storage/emulated/0/Android/data/tech.kyleflynn.frcsp/files/events/testing.strat",
        modificationTime: new Date("February 21, 2017 20:45:40"),
        size: 2046000
      }];
      DebugLogger.log(LoggerLevel.ERROR, err.message + " Code " + err.code);
    });
  }

  selectAndDismiss(fileEntry) {
    this.event = fileEntry;
    this.dismiss();
  }

  dismiss() {
    let data = { file: this.event };
    this.viewCtrl.dismiss(data);
  }

}
