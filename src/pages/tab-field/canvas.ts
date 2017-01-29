/**
 * Created by Kyle Flynn on 1/29/2017.
 */

export class Canvas {

  content: any;
  canvas_img: any;
  img: any;

  constructor(content, img) {
    this.content = content;
    this.canvas_img = img;
    this.img = this.canvas_img.querySelector("img");
  }

  resize() {
    let totalHeight = this.img.clientHeight;
    this.content.style.height = totalHeight + "px";
    this.content.style.marginBottom = document.getElementsByClassName("tabbar")[0].clientHeight + "px";
    this.canvas_img.style.height = totalHeight + "px";
    this.canvas_img.style.marginBottom = document.getElementsByClassName("tabbar")[0].clientHeight + "px";
  }

}
