/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component, ViewChild } from '@angular/core';

import {Content, AlertController, ToastController, ModalController, LoadingController} from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";
import { Canvas } from "./canvas";
import { Style } from "../../util/style";
import {FileWriter, FileGetter} from "../../util/file-manager";
import { LoggerLevel, DebugLogger } from "../../util/debug-logger";
import {FieldFilesModal} from "../../modals/field-files-modal/field-files-modal";

@Component({
  selector: 'page-field',
  templateUrl: 'tab-field.html'
})
export class FieldPage {

  @ViewChild(Content) page_content: Content;

  connection: ConnectionManager;

  canvas_manager: Canvas;
  content: any;
  canvas_img: any;

  last_palette: any;

  draw_mode: string;

  color: string;
  red: number;
  green: number;
  blue: number;
  size: number;

  team_number: number;
  team_alliance: string;
  teams: any;

  constructor(private alertCtrl: AlertController, private loadCtrl: LoadingController, private toastCtrl: ToastController, private modalCtrl: ModalController) {
    this.canvas_manager = new Canvas();
    this.connection = new ConnectionManager();
    this.connection.setAlertController(alertCtrl);
    this.connection.setLoadController(loadCtrl);

    this.color = "";
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.size = 3;
    this.draw_mode = "pencil";
    this.teams = [];
    this.team_number = null;
    this.team_alliance = null;
  }

  ionViewWillEnter() {
    this.openViewPalette();

    this.content = document.getElementById("content");
    this.canvas_img = document.getElementById("canvas-img");
    this.canvas_manager.init(this.page_content, this.content, this.canvas_img);
    this.canvas_manager.checkCanCache();

    this.updateColor();
    this.updateSize();
    setTimeout(() => {
      this.canvas_manager.resize();
      Style.fadeIn("canvas-img");
    }, 100);
  }

  ionViewDidLeave() {
    this.canvas_manager.saveState();
  }

  public openViewPalette() {
    this.last_palette = "view-palette";
    this.resetPalettes();
    this.resetMenuButtons();
    this.canvas_manager.updateMode("view");
    document.getElementById("view-btn").classList.add("active-menu");
  }

  public openDrawPalette() {
    this.resetPalettes();
    this.resetMenuButtons();
    this.openPalette("draw-palette");
    this.updateDrawMode();
    this.canvas_manager.updateMode("draw");
    document.getElementById("draw-btn").classList.add("active-menu");
  }

  public openFieldPalette() {
    this.resetPalettes();
    this.resetMenuButtons();
    this.openPalette("field-palette");
    this.canvas_manager.updateMode("field");
    document.getElementById("field-btn").classList.add("active-menu");
  }

  public openRobotPalette() {
    this.resetPalettes();
    this.resetMenuButtons();
    this.openPalette("robot-palette");
    this.canvas_manager.updateMode("robot");
    document.getElementById("robot-btn").classList.add("active-menu");
  }

  public openSavePalette() {
    this.last_palette = "save-palette";
    this.resetPalettes();
    this.resetMenuButtons();
    document.getElementById("save-btn").classList.add("active-menu");
    this.saveCanvas();
  }

  public openFilePalette() {
    this.last_palette = "file-palette";
    this.resetPalettes();
    this.resetMenuButtons();
    document.getElementById("open-btn").classList.add("active-menu");
    this.openFileModal();
  }

  public updateDrawMode() {
    this.canvas_manager.setDrawMode(this.draw_mode);
  }

  private resetPalettes() {
    let palettes = document.getElementsByClassName("palette");

    for (let i = 0; i < palettes.length; i++) {
      palettes[i].classList.remove("palette-down");
      palettes[i].classList.add("palette-up");
    }
    this.canvas_manager.setEditable(true);
  }

  private resetMenuButtons() {
    let buttons = document.getElementsByClassName("menu-button");

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active-menu");
    }
  }

  private openPalette(id) {
    let palette = document.getElementById(id);
    if (this.last_palette != id) {
      palette.classList.remove("palette-up");
      palette.classList.add("palette-down");
      this.canvas_manager.setEditable(false);
      this.last_palette = id;
    } else {
      this.last_palette = "null";
    }
  }

  saveCanvas() {
    let alert = this.alertCtrl.create({
      title: 'Save',
      message: 'Enter the name of the file you wish to save:',
      inputs: [
        {
          name: 'fileName',
          placeholder: 'qual_1'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Save',
          handler: (data) => {
            alert.dismiss().then(() => {
              FileWriter.writePermFile("strategy-files", data.fileName + ".strat", this.canvas_manager.canvas.toDataURL("image/png")).then((file) => {
                this.showToast("Saved strategy file " + file.name);
                this.openViewPalette();
                DebugLogger.log(LoggerLevel.INFO, "Saved strategy file " + file.name);
              }, (err) => {
                this.showToast(err.message);
                this.openViewPalette();
                DebugLogger.log(LoggerLevel.ERROR, data.fileName + ".strat: " + err.message + " Code " + err.code);
              });
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  openFileModal() {
    let fileModal = this.modalCtrl.create(FieldFilesModal);
    fileModal.onDidDismiss(data => {
      if (data.file) {
        DebugLogger.log(LoggerLevel.INFO, "Loading file " + data.file.name);
        this.connection.showLoader("Loading file...", 5000);
        FileGetter.readPermFile("strategy-files", data.file.name).then((base_image) => {
          this.canvas_manager.loadCanvas(base_image).then(() => {
            this.connection.hideLoader();
          });
          DebugLogger.log(LoggerLevel.INFO, "Loaded strategy file " + data.file.name);
        }, (err) => {
          this.connection.hideLoader();
          DebugLogger.log(LoggerLevel.ERROR, data.file.name + ": " + err.message + " Code " + err.code);
        });
      }
      this.openViewPalette();
    });
    fileModal.present();
  }

  clearCanvas() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Clear',
      message: 'Are you sure you want to clear the field of everything?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.canvas_manager.clearCanvas();
          }
        }
      ]
    });
    alert.present();
  }

  undoCanvas() {
    this.canvas_manager.undoState();
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 1500,
      position: 'bottom',
    });
    return toast.present();
  }

  setObject(e) {
    let items = document.getElementsByClassName("field-item");
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("selected");
    }
    let item = e.path[1];
    if (!item.classList.contains("field-item-row")) {
      item.classList.add("selected");
    }
    let img = item.querySelector("img");
    this.resetPalettes();
    this.draw_mode = "pencil";
    this.updateDrawMode();
    this.canvas_manager.setObject(img);
  }

  addTeam() {
    if (this.team_number && this.team_alliance) {
      if (this.teams.length >= 6) {
        this.teams.pop();
      }
      this.teams.unshift({
        "team_number": this.team_number,
        "alliance": this.team_alliance
      });

      setTimeout(()=> {
        let manRobots = document.getElementById("manual-robots");
        let robotItems = manRobots.getElementsByClassName("robot");

        for (let i = 0; i < this.teams.length; i++) {
          if (!robotItems[i].classList.contains(this.teams[i].alliance)) {
            robotItems[i].classList.remove(this.teams[i].alliance == "red-robot" ? "blue-robot" : "red-robot");
            robotItems[i].classList.add(this.teams[i].alliance);
          }
        }
      }, 50);

    }
  }

  setTeam(t, e) {
    let teams = document.getElementsByClassName("robot");
    for (let i = 0; i < teams.length; i++) {
      teams[i].classList.remove("selected-robot");
    }

    let team = e.path[0];
    if (!team.classList.contains("selected-robot")) {
      team.classList.add("selected-robot");
    }
    this.canvas_manager.setTeam(t);
  }

  updateSize() {
    this.canvas_manager.updateSize(this.size);
  }

  updateColor() {
    this.canvas_manager.updateColor(this.red, this.green, this.blue);
    this.color = "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    document.getElementById("color-val").style.background = this.color;
  }

}
