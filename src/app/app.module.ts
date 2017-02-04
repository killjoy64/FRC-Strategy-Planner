import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FRCSP } from './app.component';

import { TabsPage } from '../pages/tab-directory/tab-directory';
import { TeamsAndEventsPage } from '../pages/tab-teams-events/tab-teams-events';
import { FieldPage } from '../pages/tab-field/tab-field';
import { SettingsPage } from '../pages/tab-settings/tab-settings';
import { CloudPage } from '../pages/tab-my-cloud/tab-my-cloud';
import { StartupPage } from '../pages/startup/startup';

import { FieldFilesModal } from '../modals/field-files-modal/field-files-modal';
import { LibrariesModal } from '../modals/settings-libraries-modal/settings-libraries-modal';
import { LoggerModal } from '../modals/settings-logger-modal/settings-logger-modal';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'add5520f'
  }
};

enableProdMode();

@NgModule({
  declarations: [
    FRCSP,
    TabsPage,
    TeamsAndEventsPage,
    FieldPage,
    SettingsPage,
    CloudPage,
    StartupPage,
    FieldFilesModal,
    LibrariesModal,
    LoggerModal
  ],
  imports: [
    IonicModule.forRoot(FRCSP, {tabsPlacement: 'bottom'}),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FRCSP,
    TabsPage,
    TeamsAndEventsPage,
    FieldPage,
    SettingsPage,
    CloudPage,
    StartupPage,
    FieldFilesModal,
    LibrariesModal,
    LoggerModal
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
