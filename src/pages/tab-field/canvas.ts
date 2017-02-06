import { Content } from "ionic-angular";
import { LoggerLevel, DebugLogger } from "../../util/debug-logger";

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

  saves: any;

  current_object: any;
  current_team: any;

  constructor() {
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

    this.saves = [];
  }

  public init(contentRef, content, img) {
    this.page_content = contentRef;
    this.menu = document.getElementById("canvas-menu");
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.content = content;
    this.canvas_img = img;

    this.bindListeners();
  }

  private bindListeners() {
    this.canvas.addEventListener("touchstart", (e) => {
      if (this.can_edit) {
        if (this.mode == "draw") {
          if (this.drawMode == "pencil" || this.drawMode == "eraser") {
            this.saveState();
            this.startDrawing(e);
          } else if (this.drawMode == "line") {
            if (this.started_line) {
              this.endLine(e);
            } else {
              this.startLine(e);
            }
          }
        } else if (this.mode == "field") {
          this.saveState();
          this.drawObject(e);
        } else if (this.mode == "robot") {
          this.saveState();
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
              this.saveState();
            }
          }
        }
      }
    });
  }

  public clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.saves = [];
  }

  public undoState() {
    this.context.globalCompositeOperation = "source-over";
    if (this.saves.length > 0) {
      let undo = this.saves.pop();

      /* Since context is defined within canvas, we replaced it's image with our saved one */
      let img = document.createElement('img');
      img.setAttribute("src", undo);
      img.addEventListener("load", () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(img, 0, 0);
      });
    } else {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  public saveState() {
    this.saves.push(this.canvas.toDataURL());
  }

  public checkCanCache() {
    if (this.saves.length >= 1) {
      this.undoState();
      DebugLogger.log(LoggerLevel.INFO, "Reloaded cached canvas.");
    }
  }

  public loadCanvas(base_image) {
    return new Promise((resolve) => {
      let img = document.createElement('img');
      img.setAttribute("src", base_image);
      img.addEventListener("load", () => {
        this.clearCanvas();
        setTimeout(() => {
          this.context.drawImage(img, 0, 0);
          this.saveState();
          resolve();
        }, 150);
      });
    });
  }

  public resize() {
    let totalHeight = this.canvas_img.clientHeight;
    let totalWidth = this.canvas_img.clientWidth;

    if (this.canvas.clientHeight != this.canvas_img.clientHeight) {
      this.canvas.setAttribute("height", totalHeight + "px");
      this.canvas.setAttribute("width", totalWidth + "px");
      this.canvas.style.left = this.canvas_img.offsetLeft + "px";

      this.canvas.style.top = this.menu.clientHeight + "px";
      this.canvas_img.style.marginTop = this.menu.clientHeight + "px";
    }

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
    this.started_line = false;
    this.drawing_line = false;

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

  public setObject(e) {
    this.current_object = e;
  }

  public setTeam(e) {
    this.current_team = e;
  }

  private drawTeam(e) {
    if (this.current_team) {
      let x = e.touches[0].pageX - this.canvas_img.offsetLeft;
      let y = e.touches[0].pageY - this.menu.clientHeight + this.page_content.scrollTop;

      if (this.current_team.alliance == "red-robot") {
        this.context.fillStyle = "#ee0002";
      } else {
        this.context.fillStyle = "#2e74eb";
      }

      let width = 40;
      let height = 30;

      this.context.font = "12px arial";
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.fillRect(x - (width/2), y - (height/2), width, height);
      this.context.fillStyle = "#ffffff";
      this.context.fillText(this.current_team.team_number, x, y, width);
    }
  }

  private drawObject(e) {
    if (this.current_object) {
      let self = this;
      let x = e.touches[0].pageX - this.canvas_img.offsetLeft;
      let y = e.touches[0].pageY - this.menu.clientHeight + this.page_content.scrollTop;

      /* Since context is defined within canvas, we replaced it's image with our saved one */
      let img = document.createElement('img');
      img.setAttribute("src", this.current_object.getAttribute("src"));
      img.addEventListener("load", () => {
        let w = img.height * .08;
        let h = img.height * .08;
        self.context.drawImage(img, x - (w/2), y - (h/2), w, h);
      });
    }
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
