import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { StatsPage } from '../stats/stats';
import { FieldPage } from '../field/field';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tab-directory.html'
})
export class TabsPage {

  home: any = HomePage;
  stats: any = StatsPage;
  field: any = FieldPage;

  constructor() {

  }

}
