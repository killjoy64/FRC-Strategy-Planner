/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";
import { Canvas } from "./canvas";

@Component({
  selector: 'page-field',
  templateUrl: 'tab-field.html'
})
export class FieldPage {

  connection: ConnectionManager;

  canvas_manager: Canvas;

  content: any;
  canvas_img: any;

  constructor(public navCtrl: NavController) {
    this.connection = new ConnectionManager();
  }

  ionViewDidEnter() {
    this.content = document.getElementById("content");
    this.canvas_img = document.getElementById("canvas-img");
    this.canvas_manager = new Canvas(this.content, this.canvas_img);
    setTimeout(() => {
      this.canvas_manager.resize();
    }, 100);
  }

}
