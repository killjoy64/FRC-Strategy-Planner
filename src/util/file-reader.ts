import { Platform } from 'ionic-angular';
import {File, FileError, Entry} from 'ionic-native';

declare var cordova;

export class TeamAvatar {

  private fs:string;

  constructor(private platform: Platform) {
    if (platform.is("android")) {
      this.fs = cordova.file.externalDataDirectory;
    } else if (platform.is("ios")) {
      this.fs = cordova.file.documentsDirectory;
    } else if (platform.is("windows")) {
      // TODO - Write code for windows directory
    }

    File.checkDir(this.fs, 'team-data/avatars').then((bool) => {
      console.log('team-data/avatars successfully found');
    }).catch(err => {
      File.createDir(this.fs, "team-data/avatars", false).then((freeSpace) => {
        console.log("Successfully created directory team-data/avatars")
      });
    });
  }

  public hasAvatar(team) {
    File.checkFile(this.fs, "team-data/avatars/" + team + ".jpg").then((bool:boolean) => {
      return bool;
    }, (err:FileError) => {
      console.log("Error checking for avatar: " + err.message);
      return false;
    });
  }

  private getAvatar(team) {

    let self = this;
    let fileEntry = null;
    let fileEntries:Entry[] = null;

    File.listDir(this.fs, "strategy-saves").then((entries:Entry[]) => {
      fileEntries = entries;
    }).catch((err:FileError) => {
      fileEntries = null;
      console.log("Error Listing Contents - " + err.message);
      return null;
    });

    for (let i = 0; i < fileEntries.length; i++) {

    }

    fileEntry.file(function (file) {
      var reader = new FileReader();

      reader.onloadend = function() {
        console.log("Successful file read: " + this.result);
      };

      reader.readAsText(file);

    }, function(error) {
      console.log("Error Reading Contents - " + error.message);
      return null;
    });
  }

}
