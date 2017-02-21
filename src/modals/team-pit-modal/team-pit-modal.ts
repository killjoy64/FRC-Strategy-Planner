import { Component } from '@angular/core';
import { ViewController, NavParams, ToastController, AlertController } from "ionic-angular";
import { FileWriter } from "../../util/file-manager";
import {LoggerLevel, DebugLogger} from "../../util/debug-logger";

@Component({
  selector: 'page-pit-modal',
  templateUrl: 'team-pit-modal.html'
})
export class PitModal {

  team: any;

  drive_train: any;
  drive_train_other: any;

  shoot_capability: any;
  gear_capability: any;

  auto_strategy: any;
  teleop_strategy: any;
  additional_comments: any;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.team = this.navParams.get("team");

    if (this.team.pit_info) {
      this.additional_comments = this.team.pit_info.additional_comments;
      this.drive_train = this.team.pit_info.drive_train;
      this.drive_train_other = this.team.pit_info.drive_train_other;
      this.shoot_capability = this.team.pit_info.shoot_capability;
      this.gear_capability = this.team.pit_info.gear_capability;
      this.auto_strategy = this.team.pit_info.auto_strategy;
      this.teleop_strategy = this.team.pit_info.teleop_strategy;
    } else {
      this.additional_comments = "";
      this.drive_train = null;
      this.drive_train_other = null;
      this.shoot_capability = null;
      this.gear_capability = null;
      this.auto_strategy = null;
      this.teleop_strategy = null;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss().then(() => {
      this.save();
    });
  }

  save() {
    // Save Text!
    let pitForm = {
      drive_train: this.drive_train,
      drive_train_other: this.drive_train_other,
      shoot_capability: this.shoot_capability,
      gear_capability: this.gear_capability,
      auto_strategy: this.auto_strategy,
      teleop_strategy: this.teleop_strategy,
      additional_comments: this.additional_comments
    };

    this.team.pit_info = pitForm;

    FileWriter.writePermFile("pit-scouting", this.team.team_number + ".json", JSON.stringify(pitForm)).then((file) => {
      this.showToast("Saved strategy file " + this.team.team_number + ".json");
      DebugLogger.log(LoggerLevel.INFO, "Saved pit file " + file.name);
    }).catch((err) => {
      this.showToast(err.message);
      DebugLogger.log(LoggerLevel.ERROR, this.team.team_number + ".json: " + err.message + " Code " + err.code);
    });

  }

  clear() {

    let alert = this.alertCtrl.create({
      title: 'Are You Sure About This?',
      message: 'Reset all fields?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.additional_comments = "";
            this.drive_train = null;
            this.drive_train_other = null;
            this.shoot_capability = null;
            this.gear_capability = null;
            this.auto_strategy = null;
            this.teleop_strategy = null;
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 1500,
      position: 'bottom',
    });
    return toast.present();
  }

}
