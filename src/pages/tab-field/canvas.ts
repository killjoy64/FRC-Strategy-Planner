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

  started_line: boolean;
  drawing_line: boolean;

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
    this.started_line = false;
    this.drawing_line = false;

    this.color = "";
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.size = 3;

    this.bindListeners();
  }

  private bindListeners() {
    this.canvas.addEventListener("touchstart", (e) => {
      console.log(this.mode + " | " + this.drawMode);
      if (this.can_edit) {
        if (this.mode == "draw") {
          if (this.drawMode == "pencil" || this.drawMode == "eraser") {
            this.startDrawing(e);
          } else if (this.drawMode == "line") {
            if (this.started_line) {
              this.endLine(e);
            } else {
              this.startLine(e);
            }
          }
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
          if (this.drawMode == "pencil" || this.drawMode == "eraser") {
            this.drawPoint(e);
          } else if (this.drawMode == "line") {
            this.drawing_line = true;
          }
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
          if (this.drawMode == "pencil" || this.drawMode == "eraser") {
            this.endDrawing();
          } else if (this.drawMode == "line") {
            if (this.started_line && this.drawing_line) {
              this.endLine(e);
            }
          }
        }
      }
    });
  }

  public clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    this.started_line = false;
  }

  public setDrawMode(draw_mode) {
    this.drawMode = draw_mode;

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

  private startLine(e) {
    e.preventDefault();
    let x = e.touches[0].pageX - this.canvas_img.offsetLeft;
    let y = e.touches[0].pageY - this.menu.clientHeight + this.page_content.scrollTop;
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.started_line = true;
  }

  private endLine(e) {
    e.preventDefault();
    let x = e.changedTouches[0].pageX - this.canvas_img.offsetLeft;
    let y = e.changedTouches[0].pageY - this.menu.clientHeight + this.page_content.scrollTop;
    let r = this.size;
    this.context.lineWidth = r * 2;
    this.context.lineTo(x, y);
    this.context.stroke();
    this.drawing_line = false;
    this.started_line = false;
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
