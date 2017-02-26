import { File, FileError } from "ionic-native";
import { DebugLogger, LoggerLevel } from "./debug-logger";
import { Platform } from "ionic-angular";
import { Config } from "./config";
/**
 * Created by Kyle Flynn on 1/25/2017.
 */

/* Once cordova.js is invoked, this variable will actually mean something */
declare var cordova: any;

export class FileChecker {

  public static check(location, file) {
    return new Promise((resolve, reject) => {
      if (Config.IS_BROWSER) {
        resolve(false);
      } else {
        File.checkFile(AppDirectory.getPermDir() + location + "/", file).then((exists) => {
          resolve(exists);
        }, (err) => {
          resolve(false);
        });
      }
    });
  }

}

export class FileMover {

  public static move(old_dir, new_dir, old_file_name, new_file_name) {
    if (!Config.IS_BROWSER) {
      return File.moveFile(old_dir, old_file_name, new_dir, new_file_name);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject({
            code: "APP_CONFIG_BROWSER_MODE",
            message: "Could not move file. The app had trouble loading native features. Browser mode is ON."
          });
        }, 100);
      });
    }
  }

}

export class FileWriter {

  public static writePermFile(location, file_name, data) {
    if (!Config.IS_BROWSER) {
      return File.writeFile(AppDirectory.getPermDir() + location + "/", file_name, data, { replace: true });
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject({
            code: "APP_CONFIG_BROWSER_MODE",
            message: "Could not write file. The app had trouble loading native features. Browser mode is ON."
          });
        }, 100);
      });
    }
  }

}

export class FileGetter {

  public static read(location, file_name) {
    if (!Config.IS_BROWSER) {
      return File.readAsText(AppDirectory.getPermDir() + location + "/", file_name);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject({
            code: "APP_CONFIG_BROWSER_MODE",
            message: "Could not read file. The app had trouble loading native features. Browser mode is ON."
          });
        }, 100);
      });
    }
  }

  public static getFiles(location) {
    if (!Config.IS_BROWSER) {
      return File.listDir(AppDirectory.getPermDir(), location);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject({
            code: "APP_CONFIG_BROWSER_MODE",
            message: "Could not list directory contents. The app had trouble loading native features. Browser mode is ON."
          });
        }, 100);
      });
    }
  }

}

export class AppDirectory {

  /* Variables that declare the certain type of file paths */
  private static fs: string;
  private static cache: string;
  private static config: string;

  constructor() {}

  // Method that initializes the FileManager, creates directories, and assigns paths.
  public static init(platform: Platform) {
    let p = "";

    if (typeof cordova == 'undefined' || Config.IS_BROWSER) {
      Config.IS_BROWSER = true;
      DebugLogger.log(LoggerLevel.WARN, "CORDOVA NOT DEFINED. TURNING BROWSER MODE ON. NATIVE FUNCTIONS WILL NOT BE CALLED.");
    } else {
      DebugLogger.log(LoggerLevel.INFO, "CORDOVA: " + cordova);

      if (!cordova.file) {
        DebugLogger.log(LoggerLevel.ERROR, "CORDOVA FILE PLUGIN NOT FOUND");
      } else {
        DebugLogger.log(LoggerLevel.INFO, "CORDOVA FILE: " + cordova.file);

        if (platform.is("android")) {
          this.fs = cordova.file.externalDataDirectory;
          this.cache = cordova.file.externalApplicationStorageDirectory + "cache/";
          this.config = cordova.file.dataDirectory;
          p = "ANDROID";
        } else if (platform.is("ios")) {
          this.fs = cordova.file.documentsDirectory;
          this.cache = cordova.file.documentsDirectory;
          this.config = cordova.file.syncedDataDirectory;
          p = "ANDROID";
        } else if (platform.is("windows")) {
          this.fs = cordova.file.dataDirectory;
          this.cache = cordova.file.cacheDirectory;
          this.config = cordova.file.syncedDataDirectory;
          p = "WINDOWS";
        }

        DebugLogger.log(LoggerLevel.INFO, "SUCCESSFULLY MAPPED DIRECTORIES FOR " + p);
        DebugLogger.log(LoggerLevel.INFO, "PERM: " + this.fs);
        DebugLogger.log(LoggerLevel.INFO, "TEMP: " + this.cache);
        DebugLogger.log(LoggerLevel.INFO, "CONFIG: " + this.config);

        // Making sure everything else is initialized
        this.createDirs();
        this.checkConfig();
      }

    }

  }

  private static checkIfExists(file_system, location) {
    File.checkDir(file_system, location).then((bool) => {
      DebugLogger.log(LoggerLevel.INFO, location + ' successfully found');
    }).catch(err => {
      File.createDir(file_system, location, false).then((freeSpace) => {
        DebugLogger.log(LoggerLevel.INFO, "Successfully created directory " + location);
      }).catch((err => {
        DebugLogger.log(LoggerLevel.ERROR, "SEVERE ERROR WHILE CREATING DIRECTORY: " + err.message);
      }));
    });
  }

  public static createDirs() {
    this.checkIfExists(this.fs, "robots");
    this.checkIfExists(this.fs, "pit-scouting");
    this.checkIfExists(this.fs, "events");
    this.checkIfExists(this.fs, "strategy-files");
  }

  public static checkConfig() {
    File.checkFile(this.config, "config.json").then((bool:boolean) => {
      if (bool == true) {
        DebugLogger.log(LoggerLevel.INFO, "CONFIG FOUND. LOADING CONFIG...");
        this.loadConfig();
      }
      if (bool == false) {
        DebugLogger.log(LoggerLevel.WARN, "CONFIG NOT FOUND - CREATING CONFIG");

        let config = {
          team_number: Config.TEAM_NUMBER,
          auto_save_events: Config.AUTO_SAVE_EVENT
        };

        File.writeFile(this.config, "config.json", JSON.stringify(config), []).then((fileEntry) => {
          DebugLogger.log(LoggerLevel.INFO, "CREATED DEFAULT CONFIG SUCCESSFULLY");
        }).catch((err) => {
          DebugLogger.log(LoggerLevel.ERROR, err.message);
        });
      }
    }).catch((err:FileError) => {
      DebugLogger.log(LoggerLevel.INFO, "CONFIG NOT FOUND - CREATING CONFIG");

      let config = {
        team_number: Config.TEAM_NUMBER,
        auto_save_events: Config.AUTO_SAVE_EVENT
      };

      File.writeFile(this.config, "config.json", JSON.stringify(config), []).then((fileEntry) => {
        DebugLogger.log(LoggerLevel.INFO, "CREATED DEFAULT CONFIG SUCCESSFULLY");
      }).catch((err) => {
        DebugLogger.log(LoggerLevel.ERROR, err.message);
      });
    });
  }

  public static loadConfig() {
    File.readAsText(this.config, "config.json").then((data:string) => {
      let configJSON = JSON.parse(data);
      Config.TEAM_NUMBER = configJSON.team_number;
      Config.AUTO_SAVE_EVENT = configJSON.auto_save_events
    }, (err:FileError) => {
      DebugLogger.log(LoggerLevel.ERROR, err.message);
    });
  }

  public static saveConfig() {
    let config = {
      team_number: Config.TEAM_NUMBER,
      auto_save_events: Config.AUTO_SAVE_EVENT
    };
    File.writeFile(this.config, "config.json", JSON.stringify(config), { replace: true }).then((fileEntry) => {
      DebugLogger.log(LoggerLevel.INFO, "SAVED CONFIG SETTINGS SUCCESSFULLY");
    }).catch((err) => {
      DebugLogger.log(LoggerLevel.ERROR, err.message);
    });
  }

  public static getPermDir() {
    return this.fs;
  }

  public static getTempDir() {
    return this.cache;
  }

  public static getConfDir() {
    return this.config;
  }

}
