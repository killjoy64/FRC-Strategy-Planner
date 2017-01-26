/**
 * Created by Kyle Flynn on 1/25/2017.
 */

import { Component } from '@angular/core';

import { TeamsAndEventsPage } from '../tab-teams-events/tab-teams-events';
import { FieldPage } from '../tab-field/tab-field';
import { SettingsPage } from '../tab-settings/tab-settings';
import { CloudPage } from '../tab-my-cloud/tab-my-cloud';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tab-directory.html'
})
export class TabsPage {

  tba: any = TeamsAndEventsPage;
  field: any = FieldPage;
  settings: any = SettingsPage;
  cloud: any = CloudPage;

  constructor() {}

}
