import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-field',
  templateUrl: 'field.html'
})
export class FieldPage {

  canvas_container: any;
  canvas: any;
  context: any;

  constructor(public navCtrl: NavController) {
  }

  ionViewDidEnter() {
    this.canvas_container = document.getElementById("canvas");
    this.canvas = this.canvas_container.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.setDimensions();
  }

  setDimensions() {
    /* Default properties for our canvas */
    this.canvas.setAttribute("width", this.canvas_container.clientWidth + "");
    this.canvas.setAttribute("height", this.canvas_container.clientHeight + "");
  }

}
