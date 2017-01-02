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

  private avatar(team) {

    let fileEntry = null;
    let fileEntries:Entry[] = null;

    File.listDir(this.fs, "avatars").then((entries:Entry[]) => {
      fileEntries = entries;
    }).catch((err:FileError) => {
      fileEntries = null;
      console.log("Error Listing Contents - " + err.message);
      return null;
    });

    for (let i = 0; i < fileEntries.length; i++) {
      if (fileEntries[i].name == team + ".jpg") {
        fileEntry = fileEntries[i];
        break;
      }
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
  }

  public static getPermDir() {
    return this.fs;
  }

  public static getTempDir() {
    return this.cache;
  }

}
