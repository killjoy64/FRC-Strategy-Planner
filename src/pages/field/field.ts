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
  drawing: boolean;
  size: number;

  constructor(public navCtrl: NavController) {
  }

  ionViewDidEnter() {
    this.canvas_container = document.getElementById("canvas");
    this.canvas = this.canvas_container.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.drawing = false;
    this.size = 4;

    this.setDimensions();
    this.bindListeners();
  }

  setDimensions() {
    /* Default properties for our canvas */
    this.canvas.setAttribute("width", this.canvas_container.clientWidth + "");
    this.canvas.setAttribute("height", this.canvas_container.clientHeight + "");
  }

  bindListeners() {
    let self = this;

    self.canvas.addEventListener("touchstart", (e) => {
      // self.updateMode();
      self.beginDrawing(e);
    });

    self.canvas.addEventListener("touchmove", (e) => {
      // self.updateMode();
      self.drawPoint(e);
    });

    self.canvas.addEventListener("touchend", (e) => {
      // self.updateMode();
      self.endDrawing(e);
    });
  }

  beginDrawing(e) {
    // this.saveState();
    this.drawing = true;
    this.drawPoint(e);
  }

  drawPoint(e) {
    if (this.drawing) {
      // this.setBrushSize();
      // this.checkLineStyle();
      e.preventDefault();
      let x = e.touches[0].pageX;
      let y = e.touches[0].pageY;
      let r = this.size;
      this.context.lineTo(x, y);
      this.context.stroke();
      this.context.beginPath();
      this.context.lineWidth = r * 2;
      this.context.arc(x, y, r, 0, Math.PI*2);
      this.context.fill();
      this.context.beginPath();
      this.context.moveTo(x, y);
    }
  }

  endDrawing(e) {
    this.drawing = false;
    this.context.beginPath();
  }

}
