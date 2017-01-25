import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { TeamNotes } from '../../util/file-reader';

@Component({
  selector: 'team-notes-modal',
  templateUrl: 'team-notes-modal.html'
})
export class TeamNotesModal {

  teamNote: TeamNotes;

  team: any;

  drive_train: string;
  drive_train_other: string;
  shooting: string;
  gears: string;
  auto_strategy: string;
  teleop_strategy: string;
  more_info: any;

  didSave: boolean;

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.team = navParams.get("team");
    this.teamNote = new TeamNotes();

    if (this.team.team_notes) {
      this.more_info = this.team.team_notes.additional_info;
      this.drive_train = this.team.team_notes.drive_train;
      this.drive_train_other = this.team.drive_train_other;
      this.shooting = this.team.team_notes.shooting;
      this.gears = this.team.team_notes.gears;
      this.auto_strategy = this.team.team_notes.auto_strategy;
      this.teleop_strategy = this.team.team_notes.teleop_strategy;
    } else {
      this.more_info = "";
      this.drive_train = null;
      this.drive_train_other = null;
      this.shooting = null;
      this.gears = null;
      this.auto_strategy = null;
      this.teleop_strategy = null;
    }

    this.didSave = false;

  }

  checkDriveTrain() {
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      duration: 1500,
      position: 'bottom',
    });
    toast.present();
  }

  closeModal() {
    let self = this;
    if (!this.didSave) {
      let alert = this.alertCtrl.create({
        title: 'Are You Sure About This?',
        message: 'I have detected that you made changes without saving them. Are you sure you wish to exit? Changes will be lost.',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              let data = {
                'didSave': this.didSave
              };
              self.viewCtrl.dismiss(data);
            }
          }
        ]
      });
      alert.present();
    } else {
      let data = {}
      this.viewCtrl.dismiss(data);
    }

  }

  saveText() {
    // Save Text!
    let pitForm = {
      "drive_train": this.drive_train,
      "drive_train_other": this.drive_train_other,
      "shooting": this.shooting,
      "gears": this.gears,
      "auto_strategy": this.auto_strategy,
      "teleop_strategy": this.teleop_strategy,
      "additional_info": this.more_info
    };
    this.teamNote.savePitForm(this.team.team_number, pitForm).then((entry) => {
      this.team.team_notes = pitForm;
      this.didSave = true;
      this.showToast("Successfully saved " + this.team.team_number + ".json");
    }, (err) => {
      this.showToast("Error trying to save file!");
    });;
  }

  clearText() {

    let alert = this.alertCtrl.create({
      title: 'Are You Sure About This?',
      message: 'Clear all existing data on this team?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.more_info = "";
            this.drive_train = null;
            this.drive_train_other = null;
            this.shooting = null;
            this.gears = null;
            this.auto_strategy = null;
            this.teleop_strategy = null;
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

}
