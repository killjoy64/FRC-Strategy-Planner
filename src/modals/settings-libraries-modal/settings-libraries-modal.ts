/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";

@Component({
  selector: 'page-libraries-modal',
  templateUrl: 'settings-libraries-modal.html'
})
export class LibrariesModal {

  constructor(private viewCtrl: ViewController) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
