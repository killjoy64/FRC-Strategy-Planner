import { Component } from '@angular/core';
import { NotesPage } from '../notes/notes';
import { StatsPage } from '../stats/stats';
import { FieldPage } from '../field/field';
import { SettingsPage } from '../settings/settings';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tab-directory.html'
})
export class TabsPage {

  notes: any = NotesPage;
  stats: any = StatsPage;
  field: any = FieldPage;
  settings: any = SettingsPage;

  constructor() {

  }

}
