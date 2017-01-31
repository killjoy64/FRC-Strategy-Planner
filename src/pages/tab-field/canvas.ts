import { Content } from "ionic-angular";

/**
 * Created by Kyle Flynn on 1/29/2017.
 */

export class Canvas {

  page_content: Content;

  menu: any;
  canvas: any;
  context: any;
  content: any;
  canvas_img: any;
  img: any;

  mode: string;
  drawMode: string;

  can_edit: boolean;

  constructor(contentRef, content, img) {
    this.page_content = contentRef;
    this.menu = document.getElementById("canvas-menu");
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.content = content;
    this.canvas_img = img;
    this.img = this.canvas_img.querySelector("img");
    this.mode = null;
    this.drawMode = null;
    this.can_edit = false;

    this.bindListeners();
  }

  private bindListeners() {
    this.canvas.addEventListener("touchstart", (e) => {
      if (this.can_edit) {
        if (this.mode == "draw") {
          this.startDrawing(e);
        } else if (this.mode == "field") {
          this.drawObject();
        } else if (this.mode == "robot") {
          this.drawTeam();
        }
      }
    });

    this.canvas.addEventListener("touchmove", (e) => {
      if (this.can_edit) {
        if (this.mode == "draw") {
          this.drawPoint(e);
        }
      }
    });

    this.canvas.addEventListener("touchend", (e) => {
      if (this.can_edit) {
        if (this.mode == "draw") {
          this.endDrawing();
        }
      }
    });
  }

  public resize() {
    let totalHeight = this.img.clientHeight;
    let totalWidth = this.img.clientWidth;
    this.canvas_img.style.height = totalHeight + "px";
    this.canvas.setAttribute("height", totalHeight + "px");
    this.canvas.setAttribute("width", totalWidth + "px");
    this.canvas.style.left = this.img.offsetLeft + "px";

    this.canvas.style.top = this.menu.clientHeight + "px";
    this.canvas_img.style.marginTop = this.menu.clientHeight + "px";
  }

  public setEditable(editable) {
    this.can_edit = editable;
  }

  public updateMode(mode) {
    this.mode = mode;
  }

  public setDrawMode(mode) {
    if (mode == "pencil") {
      this.context.globalCompositeOperation = "source-over";
    } else if (mode == "line") {
      // TODO - Implement line tool
    } else if (mode == "eraser") {
      this.context.globalCompositeOperation = "destination-out";
    }
  }

  private drawTeam() {

  }

  private drawObject() {

  }

  private startDrawing(e) {
    this.drawPoint(e);
  }

  private drawPoint(e) {
    e.preventDefault();
    // this.updateColor();
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY - this.menu.clientHeight + this.page_content.scrollTop;
    // let r = this.size;
    let r = 2;
    this.context.lineTo(x, y);
    this.context.stroke();
    this.context.beginPath();
    this.context.lineWidth = r * 2;
    this.context.arc(x, y, r, 0, Math.PI*2);
    this.context.fill();
    this.context.beginPath();
    this.context.moveTo(x, y);
  }

  private endDrawing() {
    this.context.beginPath();
  }


}
