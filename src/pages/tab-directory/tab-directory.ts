import { Component } from '@angular/core';
import { MyEventPage } from '../my-event/my-event';
import { SearchPage } from '../search/search';
import { FieldPage } from '../field/field';
import { SettingsPage } from '../settings/settings';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tab-directory.html'
})
export class TabsPage {

  my_event: any = MyEventPage;
  search: any = SearchPage;
  field: any = FieldPage;
  settings: any = SettingsPage;

  constructor() {
  }

}
