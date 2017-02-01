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

  mode: string;
  drawMode: string;

  can_edit: boolean;

  color: string;
  red: number;
  green: number;
  blue: number;
  size: number;

  constructor(contentRef, content, img) {
    this.page_content = contentRef;
    this.menu = document.getElementById("canvas-menu");
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.content = content;
    this.canvas_img = img;
    this.mode = null;
    this.drawMode = null;
    this.can_edit = false;

    this.color = "";
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.size = 3;

    this.bindListeners();
  }

  private bindListeners() {
    this.canvas.addEventListener("touchstart", (e) => {
      if (this.can_edit) {
        if (this.mode == "draw") {
          this.startDrawing(e);
        } else if (this.mode == "field") {
          this.drawObject(e);
        } else if (this.mode == "robot") {
          this.drawTeam(e);
        }
      } else {
        if (this.mode == "draw") {
          e.preventDefault();
        } else if (this.mode == "field") {
          e.preventDefault();
        } else if (this.mode = "robot") {
          e.preventDefault();
        }
      }
    });

    this.canvas.addEventListener("touchmove", (e) => {
      if (this.can_edit) {
        if (this.mode == "draw") {
          this.drawPoint(e);
        }
      } else {
        if (this.mode == "draw") {
          e.preventDefault();
        } else if (this.mode == "field") {
          e.preventDefault();
        } else if (this.mode = "robot") {
          e.preventDefault();
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
    let totalHeight = this.canvas_img.clientHeight;
    let totalWidth = this.canvas_img.clientWidth;
    this.canvas_img.style.height = totalHeight + "px";
    this.canvas.setAttribute("height", totalHeight + "px");
    this.canvas.setAttribute("width", totalWidth + "px");
    this.canvas.style.left = this.canvas_img.offsetLeft + "px";

    this.canvas.style.top = this.menu.clientHeight + "px";
    this.canvas_img.style.marginTop = this.menu.clientHeight + "px";
  }

  public setEditable(editable) {
    this.can_edit = editable;
  }

  public updateMode(mode) {
    this.mode = mode;
  }

  public setDrawMode(draw_mode) {
    if (draw_mode == "pencil") {
      this.context.globalCompositeOperation = "source-over";
    } else if (draw_mode == "line") {
      // TODO - Implement line tool
    } else if (draw_mode == "eraser") {
      this.context.globalCompositeOperation = "destination-out";
    }
  }

  public updateColor(r, g, b) {
    let color = "rgb(" + r + "," + g + "," + b + ")";
    this.context.strokeStyle = color;
    this.context.fillStyle = color;
  }

  public updateSize(size) {
    this.size = size;
  }

  private drawTeam(e) {

  }

  private drawObject(e) {

  }

  private startDrawing(e) {
    this.drawPoint(e);
  }

  private drawPoint(e) {
    e.preventDefault();
    let x = e.touches[0].pageX - this.canvas_img.offsetLeft;
    let y = e.touches[0].pageY - this.menu.clientHeight + this.page_content.scrollTop;
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

  private endDrawing() {
    this.context.beginPath();
  }

}
