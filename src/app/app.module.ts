import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import {NgModule, ErrorHandler, enableProdMode} from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FRCSP } from './app.component';
import { MyEventPage } from '../pages/my-event/my-event';
import { EventPage } from '../pages/event/event';
import { LoginPage } from '../pages/login/login';
import { SearchPage } from '../pages/search/search';
import { FieldPage } from '../pages/field/field';
import { SettingsPage } from '../pages/settings/settings';
import { OpenFilePage } from '../pages/open-file/open-file';
import { TeamAwardsPage } from '../pages/team-awards/team-awards';
import { TeamEventsPage } from '../pages/team-events/team-events';
import { TeamInfoPage } from '../pages/team-info/team-info';
import { TeamRobotsPage } from '../pages/team-robots/team-robots';
import { EventTeamsPage } from '../pages/event-teams/event-teams';
import { EventMatchesPage } from '../pages/event-matches/event-matches';
import { EventRankingsPage } from '../pages/event-rankings/event-rankings';
import { EventElimsPage } from '../pages/event-elims/event-elims';
import { EventAwardsPage } from "../pages/event-awards/event-awards";
import { EventTeamPage } from '../pages/event-team/event-team';
import { TabsPage } from '../pages/tab-directory/tab-directory';
import { AboutChangelogPage } from '../pages/about-changelog/about-changelog';
import { AboutLibrariesPage } from '../pages/about-libraries/about-libraries';

import { TeamNotesModal } from '../modals/team-notes-modal';
import {Config} from "../util/config";

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'add5520f'
  }
};

if (!Config.DEBUG) {
  enableProdMode();
}

@NgModule({
  declarations: [
    FRCSP,
    MyEventPage,
    EventPage,
    SearchPage,
    FieldPage,
    SettingsPage,
    OpenFilePage,
    TeamAwardsPage,
    TeamEventsPage,
    TeamInfoPage,
    TeamRobotsPage,
    EventTeamsPage,
    EventMatchesPage,
    EventRankingsPage,
    EventElimsPage,
    EventAwardsPage,
    EventTeamPage,
    LoginPage,
    TabsPage,
    AboutChangelogPage,
    AboutLibrariesPage,
    TeamNotesModal
  ],
  imports: [
    IonicModule.forRoot(FRCSP, {tabsPlacement: 'bottom'}),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FRCSP,
    MyEventPage,
    EventPage,
    SearchPage,
    FieldPage,
    SettingsPage,
    OpenFilePage,
    TeamAwardsPage,
    TeamEventsPage,
    TeamInfoPage,
    TeamRobotsPage,
    EventTeamsPage,
    EventMatchesPage,
    EventRankingsPage,
    EventElimsPage,
    EventAwardsPage,
    EventTeamPage,
    LoginPage,
    TabsPage,
    AboutChangelogPage,
    AboutLibrariesPage,
    TeamNotesModal
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
