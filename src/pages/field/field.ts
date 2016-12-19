import {Component} from '@angular/core';
import {PopoverController, NavController} from 'ionic-angular';

@Component({
  selector: 'page-field',
  templateUrl: 'field.html'
})
export class FieldPage {

  EDIT: number;
  FIELD: number;
  CLEAR: number;
  SAVE: number;
  VIEW: number;

  main_palette: any;
  canvas_container: any;
  canvas: any;
  context: any;
  drawing: boolean;
  dragging: boolean;

  /* Color declarations */
  red: number;
  green: number;
  blue: number;

  /* Brush declarations */
  size: number;
  color: string;

  constructor(public navCtrl: NavController, private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
    this.red = 0;
    this.green = 0;
    this.blue = 0;

    this.updateRed();
    this.updateGreen();
    this.updateBlue();
  }

  ionViewDidEnter() {
    this.main_palette = document.getElementById("main-palette");
    this.canvas_container = document.getElementById("canvas");
    this.canvas = this.canvas_container.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.dragging = false;
    this.drawing = false;

    this.size = 4;
    this.color = "rgb(0,0,0)";

    this.EDIT = 0;
    this.FIELD = 1;
    this.CLEAR = 2;
    this.SAVE = 3;
    this.VIEW = 4;

    this.setDimensions();
    this.clearVisiblePalettes();
    this.bindListeners();
  }

  setDimensions() {
    /* Default properties for our canvas */
    this.canvas_container.style.marginTop = document.getElementById("canvas-menu").offsetHeight + "px";
    this.canvas.setAttribute("width", this.canvas_container.clientWidth + "");
    this.canvas.setAttribute("height", this.canvas_container.clientHeight + "");
  }

  bindListeners() {
    let self = this;

    /* Canvas drawing events */
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
    this.drawing = false;
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

  clearVisiblePalettes() {
    let palettes = document.getElementsByClassName("palette");

    for (let i = 0; i < palettes.length; i++) {
      palettes[i].classList.remove("visible");
      palettes[i].classList.add("hidden");
      palettes[i].setAttribute("style", "transform: translateY(-100%)");
    }

  }

  isActiveItem(e) {
    return e.classList.contains("active-item");
  }

  isItemVisible(e) {
    return e.classList.contains("visible");
  }

  resetActiveItems() {
    let menuItems = document.getElementsByClassName("canvas-menu-item");

    for (let i = 0; i < menuItems.length; i++) {
      menuItems[i].classList.remove("active-item");
    }
  }

  togglePalette(ID) {
    let offset = document.getElementById("canvas-menu").offsetHeight;
    let e = "";
    let pal = ""

    switch(ID) {
      case this.EDIT:
        e = "draw-menu";
        pal = "draw-palette";
        break;

      case this.FIELD:
        e = "field-menu";
        pal = "field-palette";
        break;

      case this.CLEAR:
        e = "clear-menu";
        pal = null;
        break;

      case this.SAVE:
        e = "save-menu";
        pal = null;
        break;

      case this.VIEW:
        e = "view-menu";
        pal = null;
        break;
    }

    let item = document.getElementById(e);
    let palette = null;

    try {
      palette = document.getElementById(pal);
    } catch(e) {
      palette = null;
    }

    console.log(item);
    console.log(palette);

    if (palette) {
      if (this.isActiveItem(item)) {
        if (this.isItemVisible(palette)) {
          palette.style.transform = "translateY(-100%)";
          palette.classList.remove("visible");
          palette.classList.add("hidden");
        } else {
          palette.style.transform = "translateY(" + offset + "px)";
          palette.classList.remove("hidden");
          palette.classList.add("visible");
        }
      } else {
        this.resetActiveItems();
        this.clearVisiblePalettes();
        item.classList.add("active-item");
        palette.style.transform = "translateY(" + offset + "px)";
        palette.classList.remove("hidden");
        palette.classList.add("visible");
      }
    } else {
      this.resetActiveItems();
      this.clearVisiblePalettes();
      item.classList.add("active-item");
    }


  }

  updateRed() {
    document.getElementById("red-val").innerHTML = this.red + "";
    this.updateColor();
  }

  updateGreen() {
    document.getElementById("green-val").innerHTML = this.green + "";
    this.updateColor();
  }

  updateBlue() {
    document.getElementById("blue-val").innerHTML = this.blue + "";
    this.updateColor();
  }

  updateColor() {
    this.color = "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    console.log("Updated color: " + this.color);
  }

}
