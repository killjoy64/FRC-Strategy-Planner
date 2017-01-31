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

  last_palette: any;

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

  public openViewPalette() {
    this.last_palette = "view-palette";
    this.resetPalettes();
    document.getElementById("view-btn").classList.add("active-menu");
  }

  public openDrawPalette() {
    this.resetPalettes();
    this.openPalette("draw-palette");
    document.getElementById("draw-btn").classList.add("active-menu");
  }

  public openFieldPalette() {
    this.resetPalettes();
    this.openPalette("field-palette");
    document.getElementById("field-btn").classList.add("active-menu");
  }

  public openRobotPalette() {
    this.resetPalettes();
    this.openPalette("robot-palette");
    document.getElementById("robot-btn").classList.add("active-menu");
  }

  public openSavePalette() {
    this.last_palette = "save-palette";
    this.resetPalettes();
    document.getElementById("save-btn").classList.add("active-menu");
    this.saveCanvas();
  }

  public openFilePalette() {
    this.last_palette = "file-palette";
    this.resetPalettes();
    document.getElementById("open-btn").classList.add("active-menu");
    this.openFileModal();
  }

  private resetPalettes() {
    let palettes = document.getElementsByClassName("palette");

    for (let i = 0; i < palettes.length; i++) {
      palettes[i].classList.remove("palette-down");
      palettes[i].classList.add("palette-up");
    }

    let buttons = document.getElementsByClassName("menu-button");

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active-menu");
    }
  }

  private openPalette(id) {
    this.resetPalettes();

    if (this.last_palette != id) {
      let palette = document.getElementById(id);
      palette.classList.remove("palette-up");
      palette.classList.add("palette-down");
    }

    this.last_palette = id;
  }

  saveCanvas() {

  }

  openFileModal() {

  }

}
