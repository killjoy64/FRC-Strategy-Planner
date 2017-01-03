import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';

@Component({
  selector: 'page-event-awards',
  templateUrl: 'event-awards.html'
})
export class EventAwardsPage {

  @ViewChild(Content) content: Content;

  event: any;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.event = navParams.get("event");
    console.log(this.event.awards);
  }

  checkScroll(e) {
    let scroll = document.getElementById("scroll");
    if (e.scrollTop >= 150) {
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
  }

  scrollToTop() {
    this.content.scrollToTop(1200);
  }

}
