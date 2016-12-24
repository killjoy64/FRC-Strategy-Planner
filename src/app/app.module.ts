import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FRCSP } from './app.component';
import { NotesPage } from '../pages/notes/notes';
import { LoginPage } from '../pages/login/login';
import { StatsPage } from '../pages/stats/stats';
import { FieldPage } from '../pages/field/field';
import { SettingsPage } from '../pages/settings/settings';
import { OpenFilePage } from '../pages/open-file/open-file';
import { TabsPage } from '../pages/tab-directory/tab-directory';

@NgModule({
  declarations: [
    FRCSP,
    NotesPage,
    StatsPage,
    FieldPage,
    SettingsPage,
    OpenFilePage,
    LoginPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(FRCSP, {tabsPlacement: 'bottom'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FRCSP,
    NotesPage,
    StatsPage,
    FieldPage,
    SettingsPage,
    OpenFilePage,
    LoginPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
