import { Component } from '@angular/core';
import { TBAService } from '../../providers/tba-service'

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
  providers: [TBAService]
})
export class StatsPage {

  data: any;

  constructor(private tba: TBAService) {
  }

  ionViewDidEnter() {
    this.getData();
  }

  getData() {
    this.tba.load()
      .then(data => {
        this.data = data;
        document.getElementById("res").innerHTML = JSON.stringify(this.data) + "";
      });
  }

}
