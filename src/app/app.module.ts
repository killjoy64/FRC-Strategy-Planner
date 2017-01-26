import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FRCSP } from './app.component';

import { TabsPage } from '../pages/tab-directory/tab-directory';
import { TeamsAndEventsPage } from '../pages/tab-teams-events/tab-teams-events';
import { FieldPage } from '../pages/tab-field/tab-field';
import { SettingsPage } from '../pages/tab-settings/tab-settings';
import { CloudPage } from '../pages/tab-my-cloud/tab-my-cloud';
import { StartupPage } from '../pages/startup/startup';

@NgModule({
  declarations: [
    FRCSP,
    TabsPage,
    TeamsAndEventsPage,
    FieldPage,
    SettingsPage,
    CloudPage,
    StartupPage
  ],
  imports: [
    IonicModule.forRoot(FRCSP, {tabsPlacement: 'bottom'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FRCSP,
    TabsPage,
    TeamsAndEventsPage,
    FieldPage,
    SettingsPage,
    CloudPage,
    StartupPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
