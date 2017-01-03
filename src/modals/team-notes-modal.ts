import { Component } from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'team-notes-modal',
  templateUrl: 'team-notes-modal.html'
})
export class TeamNotesModal {

  team: any;
  text: any;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.team = navParams.get("team");
    this.text = "";
  }

  closeModal() {
    let data = {}
    this.viewCtrl.dismiss(data);
  }

  saveText() {
    // Save Text!
  }

  clearText() {
    this.text = "";
  }

}
