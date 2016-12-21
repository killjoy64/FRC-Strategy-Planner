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

  /* Data variables  */
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
    // this.getAllEvents("events/2016");
    this.getAllTeams("team/frc254");
  }

  searchForTeam(team) {
    this.tba.reset();
    this.getAllTeams("team/frc" + team);
  }

  showLoading(msg) {

    this.load = this.loadingCtrl.create({
      content: msg
    });

    this.load.present();

    setTimeout(() => {
      if (this.load != null) {
        this.showAlert("Timeout", "Took to long to retrieve data from TBA.");
        this.load.dismiss();
      }
    }, 5000);
  }

  showAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  getAllTeams(url) {
    if (!this.load) {
      this.showLoading('Loading Please Wait...');
    }

    this.requestID++;
    this.openRequests++;

    this.tba.sendRequest(url)
      .then(response => {
        this.openRequests--;
        if (this.load && this.openRequests == 0) {
          this.load.dismiss();
          this.load = null;
        }
        if (this.team != response) {
          this.team = null;
        }
        this.team = response;
      }, error => {
        this.showAlert("Error", "Did not find any results for that team number.");
      });
  }

  getAllEvents(url) {
    if (!this.load) {
      this.showLoading('Loading Please Wait...');
    }

    this.requestID++;
    this.openRequests++;

    this.tba.sendRequest(url)
      .then(response => {
        this.openRequests--;
        if (this.load && this.openRequests == 0) {
          this.load.dismiss();
          this.load = null;
        }
        this.events = response;
      }, error => {
        this.showAlert("Error", "Error requesting The Blue Alliance Data!");
    });
  }

}
