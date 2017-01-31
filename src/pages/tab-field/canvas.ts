/**
 * Created by Kyle Flynn on 1/29/2017.
 */

export class Canvas {

  menu: any;
  canvas: any;
  context: any;
  content: any;
  canvas_img: any;
  img: any;

  constructor(content, img) {
    this.menu = document.getElementById("canvas-menu");
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.content = content;
    this.canvas_img = img;
    this.img = this.canvas_img.querySelector("img");
  }

  resize() {
    let totalHeight = this.img.clientHeight;
    let totalWidth = this.img.clientWidth;
    this.canvas_img.style.height = totalHeight + "px";
    this.canvas.setAttribute("height", totalHeight + "px");
    this.canvas.setAttribute("width", totalWidth + "px");
    this.canvas.style.left = this.img.offsetLeft + "px";

    this.canvas.style.top = this.menu.clientHeight + "px";
    this.canvas_img.style.marginTop = this.menu.clientHeight + "px";
  }

}
