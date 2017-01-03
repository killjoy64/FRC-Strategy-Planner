import { Platform } from 'ionic-angular';
import {File, FileError, Entry} from 'ionic-native';

declare var cordova;

export class TeamAvatar {

  private fs:string;

  constructor() {
    this.fs = AppDirectory.getPermDir();
  }

  public getAvatars() {
    let promise = File.listDir(AppDirectory.getPermDir(), "avatars").then((entries:Entry[]) => {
      return entries;
    }).catch((err:FileError) => {
      console.log("ERROR GETTING AVATARS - " + err.message);
    });
    return promise;
  }

  public getAvatar(team) {
    let promise = File.checkFile(this.fs, "avatars/" + team + ".jpg").then((bool:boolean) => {
      if (bool == true) {
        console.log("FOUND AVATAR FOR TEAM " + team);
        return this.fs + "avatars/" + team + ".jpg";
      }
      if (bool == false) {
        console.log("NO AVATAR FOR TEAM " + team);
        return "";
      }
    }).catch((err:FileError) => {
      console.log("ERROR FINDING AVATAR FOR TEAM " + team + " - " + err.message);
    });

    return promise;
  }

}

export class TeamNotes {

  private fs: string;

  constructor() {
    this.fs = AppDirectory.getPermDir();
  }

  saveNotes(team, data) {
    let promise = File.writeFile(this.fs, "notes/" + team + ".dat", data, []).then((fileEntry) => {
      console.log("Saved file successfully");
      return fileEntry;
    }).catch((err) => {
      console.log(err);
    });
    return promise;
  }

  getNotes(team) {
    let fileEntry = null;
    let fileEntries:Entry[] = null;

    let promise = File.listDir(this.fs, "notes").then((entries:Entry[]) => {
      fileEntries = entries;

      for (let i = 0; i < fileEntries.length; i++) {
        if (fileEntries[i].name == team.team_number + ".dat") {
          fileEntry = fileEntries[i];
          break;
        }
      }

      let data = new Promise((resolve, reject) => {

        if (fileEntry) {
          fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {
              // team.team_notes = this.result;
              resolve(this.result);
            };

            reader.readAsText(file);

          }, function(error) {
            reject(error);
          });
        } else {
          reject("FileEntry is null!");
        }

      });

      return data;

    }).catch((err:FileError) => {
      fileEntries = null;
      console.log("Error Listing Contents - " + err.message);
      return null;
    });

    return promise;

  }

}

export class AppDirectory {

  private static fs: string;
  private static cache: string;

  constructor() {}

  public static init(platform: Platform) {
    let p = "";

    if (platform.is("android")) {
      this.fs = cordova.file.externalDataDirectory;
      p = "ANDROID";
    } else if (platform.is("ios")) {
      this.fs = cordova.file.documentsDirectory;
      p = "ANDROID";
    } else if (platform.is("windows")) {
      // TODO - Write code for windows directory
      p = "WINDOWS";
    }

    if (platform.is("android")) {
      this.cache = cordova.file.externalApplicationStorageDirectory + "cache/";
      p = "ANDROID";
    } else if (platform.is("ios")) {
      this.cache = cordova.file.documentsDirectory;
      p = "ANDROID";
    } else if (platform.is("windows")) {
      // TODO - Write code for windows directory
      p = "WINDOWS";
    }

    console.log("SUCCESSFULLY MAPPED DIRECTORIES FOR " + p);
    console.log("MAPPED DIRECTORIES: ");
    console.log("PERM: " + this.fs);
    console.log("TEMP: " + this.cache);
  }

  public static createDirs() {
    File.checkDir(this.fs, 'avatars').then((bool) => {
      console.log('avatars successfully found');
    }).catch(err => {
      File.createDir(this.fs, "avatars", false).then((freeSpace) => {
        console.log("Successfully created directory avatars")
      }).catch((err => {
        console.log("SEVERE ERROR WHILE CREATING DIRECTORY: " + err.message);
      }));
    });

    File.checkDir(this.fs, 'notes').then((bool) => {
      console.log('notes successfully found');
    }).catch(err => {
      File.createDir(this.fs, "notes", false).then((freeSpace) => {
        console.log("Successfully created directory notes")
      }).catch((err => {
        console.log("SEVERE ERROR WHILE CREATING DIRECTORY: " + err.message);
      }));
    });
  }

  public static getPermDir() {
    return this.fs;
  }

  public static getTempDir() {
    return this.cache;
  }

}
