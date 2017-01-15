import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { TeamNotes } from '../util/file-reader';

@Component({
  selector: 'team-notes-modal',
  templateUrl: 'team-notes-modal.html'
})
export class TeamNotesModal {

  teamNote: TeamNotes;

  team: any;
  text: any;

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.team = navParams.get("team");
    this.teamNote = new TeamNotes();

    if (this.team.team_notes) {
      this.text = this.team.team_notes;
    } else {
      this.text = "";
    }

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
    if (this.text != this.team.team_notes) {
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
              let data = {}
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
    this.teamNote.saveNotes(this.team.team_number, this.text).then((entry) => {
      this.team.team_notes = this.text;
      this.showToast("Successfully saved " + this.team.team_number + ".dat");
    }, (err) => {
      this.showToast("Error trying to save file!");
    });
  }

  clearText() {
    this.text = "";
  }

}
