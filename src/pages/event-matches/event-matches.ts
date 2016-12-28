import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';

@Component({
  selector: 'page-event-matches',
  templateUrl: 'event-matches.html'
})
export class EventMatchesPage {

  @ViewChild(Content) content: Content;

  event: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.event = navParams.get("event");
  }

  ngAfterViewInit() {
    this.content.addScrollListener((e) => {
      let scroll = document.getElementById("scroll");
      if (e.target.scrollTop >= 150) {
        if (scroll.classList.contains("hidden")) {
          scroll.classList.remove("hidden");
          scroll.classList.add("visible");
        }
      } else {
        if (scroll.classList.contains("visible")) {
          scroll.classList.remove("visible");
          scroll.classList.add("hidden");
        }
      }
    });
  }

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

}
