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
import { TeamPage } from '../pages/team/team';
import { EventPage } from '../pages/event/event';

import { FieldFilesModal } from '../modals/field-files-modal/field-files-modal';
import { LibrariesModal } from '../modals/settings-libraries-modal/settings-libraries-modal';
import { LoggerModal } from '../modals/settings-logger-modal/settings-logger-modal';
import { AccountCreateModal } from '../modals/account-create-modal/account-create-modal';
import { AccountLoginModal } from '../modals/account-login-modal/account-login-modal';

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
    TeamPage,
    EventPage,
    FieldFilesModal,
    LibrariesModal,
    LoggerModal,
    AccountCreateModal,
    AccountLoginModal
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
    TeamPage,
    EventPage,
    FieldFilesModal,
    LibrariesModal,
    LoggerModal,
    AccountCreateModal,
    AccountLoginModal
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
