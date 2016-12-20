import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FRCSP } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { StatsPage } from '../pages/stats/stats';
import { FieldPage } from '../pages/field/field';
import { TabsPage } from '../pages/tab-directory/tab-directory';

@NgModule({
  declarations: [
    FRCSP,
    HomePage,
    StatsPage,
    FieldPage,
    LoginPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(FRCSP, {tabsPlacement: 'bottom'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FRCSP,
    HomePage,
    StatsPage,
    FieldPage,
    LoginPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
