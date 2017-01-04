import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FRCSP } from './app.component';
import { NotesPage } from '../pages/notes/notes';
import { LoginPage } from '../pages/login/login';
import { StatsPage } from '../pages/stats/stats';
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
import { EventAwardsPage } from "../pages/event-awards/event-awards";
import { EventTeamPage } from '../pages/event-team/event-team';
import { TabsPage } from '../pages/tab-directory/tab-directory';
import { AboutChangelogPage } from '../pages/about-changelog/about-changelog';
import { AboutLibrariesPage } from '../pages/about-libraries/about-libraries';

import { TeamNotesModal } from '../modals/team-notes-modal';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'add5520f'
  }
};

@NgModule({
  declarations: [
    FRCSP,
    NotesPage,
    StatsPage,
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
    NotesPage,
    StatsPage,
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
