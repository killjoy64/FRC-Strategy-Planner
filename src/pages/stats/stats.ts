import { Component } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';
import { TBAService } from '../../providers/tba-service'

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
  providers: [TBAService]
})
export class StatsPage {

  /* AJAX Request Variables */
  openRequests: any;
  requestID: number;
  load: any;

  /* AJAX data holding variables  */
  public events: any;
  public team: any;
  public my_comp: any;

  /* Data bindings */
  viewType: string;
  teamNumber: number;

  constructor(private tba: TBAService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.openRequests = 0;
    this.requestID = 0;
    this.viewType = 'my_comp';
    this.teamNumber = 254;
  }

  showAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  getTeamInfo(team) {
    this.tba.requestCompleteTeamInfo(team)
      .subscribe(
        data => {
          this.team = data[0];
          this.team.years = data[1].length;
        },
        err => {
          this.team = null;
          this.showAlert("Error", "Did not find any team matching that number.");
        }
      );
  }

}
