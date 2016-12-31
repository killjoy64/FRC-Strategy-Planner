import {Component, ViewChild} from '@angular/core';
import {NavController, AlertController, LoadingController, Content, Platform, Loading} from 'ionic-angular';
import {File} from 'ionic-native';
import {OpenFilePage} from '../open-file/open-file';
import {NotesPage} from '../notes/notes';
import {MatchSorter} from '../../util/sorting';
import {MatchConverter} from '../../util/string-converter';
import {Config} from '../../util/config';

declare var cordova: any;

@Component({
  selector: 'page-field',
  templateUrl: 'field.html',
})
export class FieldPage {

  @ViewChild(Content) canvasContent: Content;

  matchSorter: MatchSorter;
  matchConverter: MatchConverter;

  my_comp: any;
  my_matches: any;
  my_match: any;
  my_match_key: any;

  /* Palette constants */
  EDIT: number;
  FIELD: number;
  ROBOT: number;
  SAVE: number;
  OPEN: number;
  VIEW: number;

  /* Brush type constants */
  PENCIL: number;
  LINE: number;
  ERASER: number;

  /* Element declarations */
  main_palette: any;
  canvas_scroll: any;
  canvas_container: any;
  canvas: any;
  context: any;

  /* Control variables */
  drawing: boolean;
  dragging: boolean;
  canEdit: boolean;
  initialized: boolean;

  /* Brush property declarations */
  drawingType: number;
  drawingValue: string;
  currentMode: number;
  size: number;
  color: string;

  /* Color declarations */
  red: number;
  green: number;
  blue: number;

  /* Stack declarations */
  saves: any;
  redos: any;

  /* Robot palette helper declarations */
  robot_count: number;
  robot_team_number: number;
  robot_team_alliance: string;
  robots: any;

  /* File System declarations */
  platform:any;
  fs:string;

  currentLoad: Loading;

  /* Allows us to pass data */
  public static savedStrat: any;

  constructor(private alertCtrl: AlertController, private loadCtrl: LoadingController, private navCtrl: NavController, private plt: Platform) {
  this.matchSorter = new MatchSorter();
  this.matchConverter = new MatchConverter();

  this.drawingValue = "pencil";

  // We initialize these first so that they aren't destroyed whenever we exit the DOM
  this.robots = [];
  this.saves = [];
  this.redos = [];

  this.platform = plt;

  this.currentLoad = null;

  if (!Config.IS_BROWSER) {

    if (this.platform.is("android")) {
      this.fs = cordova.file.externalDataDirectory;
      console.log("Android file system detected.")
    } else if (this.platform.is("ios")) {
      this.fs = cordova.file.documentsDirectory;
      console.log("iOS file system detected.")
    } else if (this.platform.is("windows")) {

    }

    File.checkDir(this.fs, 'strategy-saves').then((bool) => {
      console.log('strategy-saves found')
    }).catch(err => {
      File.createDir(this.fs, "strategy-saves", false).then((freeSpace) => {
        console.log("Successfully created strategy-saves")
      });
    });
  }
}

  ionViewWillEnter() {
    if (OpenFilePage.hasData) {
      if (!this.currentLoad) {
        this.currentLoad = this.loadCtrl.create({
          content: 'Loading File...'
        });
        this.currentLoad.present();
      }
    }
    if (NotesPage.CURRENT_EVENT) {
      this.my_comp = NotesPage.CURRENT_EVENT;

      // Sort our matches
      let items = this.my_comp.matches;
      this.my_comp.matches = this.matchSorter.quicksort(items, 0, items.length - 1);
    } else {
      this.my_comp = null;
      this.my_match = null;
      this.my_matches = null;
      this.my_match_key = null;
    }
  }

  ionViewDidEnter() {
    this.main_palette = document.getElementById("main-palette");
    this.canvas_scroll = document.getElementById("canvas-scroll");
    this.canvas_container = document.getElementById("canvas");
    this.canvas = this.canvas_container.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    /* Control variables */
    this.dragging = false;
    this.drawing = true;
    this.canEdit = true;

    /* Brush defaults */
    this.size = 4;
    this.red = 0;
    this.green = 0;
    this.blue = 0;

    this.updateRed();
    this.updateGreen();
    this.updateBlue();
    this.updateBrushSize();

    this.EDIT = 0;
    this.FIELD = 1;
    this.ROBOT = 2;
    this.SAVE = 3;
    this.VIEW = 4;
    this.OPEN = 5;

    this.PENCIL = 0;
    this.LINE = 1;
    this.ERASER = 2;

    this.currentMode = 0;
    this.drawingType = 0;

    this.setDimensions();
    this.clearVisiblePalettes();
    this.bindListeners();

    if (this.saves.length >= 1) {
      this.undoState();
      console.log("Successfully reloaded cached canvas");
    }

    if (OpenFilePage.hasData) {
      console.log("Loading File: " + FieldPage.savedStrat.name);
      this.loadFile(FieldPage.savedStrat);
    } else {
      FieldPage.savedStrat = null;
    }
  }

  getMatchesForTeam(team) {
    this.my_matches = [];

    for (let match of this.my_comp.matches) {
      for (let i = 0; i < 3; i++) {
        if (match.alliances.blue.teams[i] == team.key) {
          this.my_matches.push(match);
        }
        if (match.alliances.red.teams[i] == team.key) {
          this.my_matches.push(match);
        }
      }
    }
  }

  getMatch() {
    for (let match of this.my_comp.matches) {
      if (match.key == this.my_match_key) {
        this.my_match = match;
        break;
      }
    }
  }

  loadFile(fileEntry) {
    let self = this;

    fileEntry.file(function (file) {
      var reader = new FileReader();

      reader.onloadend = function() {
        console.log("Successful file read: " + this.result);
        let img = document.createElement('img');
        img.setAttribute("src", this.result);

        // self.canvas.setAttribute("height", self.canvas_container.clientHeight + "");

        img.addEventListener("load", () => {
          self.currentLoad.dismiss();
          self.clearCanvas();
          self.context.drawImage(img, 0, 0);
          self.saveState();
          self.currentLoad = null;
          self.togglePalette(self.EDIT);
          self.togglePalette(self.EDIT);
          OpenFilePage.hasData = false;
        });
      };

      reader.readAsText(file);

    }, function(error) {
      console.log("Error - " + error.message);
      return null;
    });
  }

  ionViewDidLeave() {
    if (this.saves.length >= 1) {
      this.saveState();
      console.log("Saved current canvas");
    }
  }

  setDimensions() {
    let height = window.innerHeight - (document.getElementById("canvas-menu").offsetHeight);

    this.canvas_scroll.style.marginTop = document.getElementById("canvas-menu").offsetHeight + "px";
    this.canvas_scroll.style.height = height + "px";

    /* Default properties for our canvas */
    this.canvas.setAttribute("width", this.canvas_container.clientWidth + "");
    this.canvas.setAttribute("height", this.canvas_container.clientHeight + "");
  }

  bindListeners() {
    let self = this;

    this.initialized = false;

    /* Canvas drawing events */
    self.canvas.addEventListener("touchstart", (e) => {
      if (this.initialized == false || this.canvas.height != this.canvas_container.clientHeight) {
        // self.saveState();
        // this.canvas.setAttribute("height", this.canvas_container.clientHeight + "");
        // this.initialized = true;
        // self.undoState();
      }
      if (this.currentMode == this.FIELD) {
        self.drawSelectedImage(e);
      } else if (this.currentMode == this.ROBOT) {
        self.drawSelectedRobot(e);
      } else {
        self.beginDrawing(e);
      }
    });

    self.canvas.addEventListener("touchmove", (e) => {
      self.drawPoint(e);
    });

    self.canvas.addEventListener("touchend", (e) => {
      self.endDrawing(e);
    });

  }

  confirmClear() {
    let self = this;
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to clear the field of ALL drawings? This cannot be undone.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            self.clearCanvas();
          }
        }
      ]
    });
    alert.present();
  }

  confirmSave() {
    let self = this;
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
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            if (!Config.IS_BROWSER) {
              console.log(data.fileName);
              File.writeFile(this.fs + "/strategy-saves", data.fileName + ".png", self.canvas.toDataURL("image/png"), []).then((fileEntry) => {
                console.log("Saved file successfully");
              }).catch((err) => {
                console.log(err);
              });
            }
            self.togglePalette(this.EDIT);
            self.togglePalette(this.EDIT);
          }
        }
      ]
    });
    alert.present();
  }

  saveState() {
    this.saves.push(this.canvas.toDataURL());
  }

  undoState() {
    /* Must be source-over so that we are writing over the image */
    this.context.globalCompositeOperation = "source-over";
    if (this.saves.length > 0) {
      let self = this;
      let undo = self.saves.pop();

      /* Since context is defined within canvas, we replaced it's image with our saved one */
      let img = document.createElement('img');
      img.setAttribute("src", undo);
      img.addEventListener("load", () => {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.context.drawImage(img, 0, 0);
      });
      self.redos.push(undo);
    } else {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  redoState() {
    /* Must be source-over so that we are writing over the image */
    this.context.globalCompositeOperation = "source-over";
    if (this.redos.length > 0) {
      let self = this;
      let redo = self.redos.pop();

      /* Since context is defined within canvas, we replaced it's image with our saved one */
      let img = document.createElement('img');
      img.setAttribute("src", redo);
      img.addEventListener("load", () => {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.context.drawImage(img, 0, 0);
      });
      self.saves.push(redo);
    }
  }

  beginDrawing(e) {
    this.saveState();
    if (this.canEdit) {
      this.drawing = true;
      this.drawPoint(e);
    }
  }

  drawPoint(e) {
    if (this.drawing && this.currentMode == this.EDIT && this.canEdit) {
      e.preventDefault();
      this.updateColor();
      let x = e.touches[0].pageX;
      let y = e.touches[0].pageY - this.canvas_scroll.offsetTop + this.canvasContent.getScrollTop();
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
    if (this.canEdit) {
      this.drawing = false;
      if (this.currentMode == this.EDIT) {
        this.context.beginPath();
      }
    }
  }

  addRobot() {
    if (this.robot_team_alliance && this.robot_team_number) {
      if (this.robots.length >= 6) {
        this.robots.pop();
      }
      this.robots.unshift({
        "team_number": this.robot_team_number,
        "alliance": this.robot_team_alliance
      });

      // Because our change is not shown immediately...
      setTimeout(()=> {
        let manRobots = document.getElementById("manual-robots");
        let robotItems = manRobots.getElementsByClassName("robot");

        for (let i = 0; i < this.robots.length; i++) {
          if (!robotItems[i].classList.contains(this.robots[i].alliance)) {
            robotItems[i].classList.remove(this.robots[i].alliance == "red-robot" ? "blue-robot" : "red-robot");
            robotItems[i].classList.add(this.robots[i].alliance);
          }
        }
      }, 50);

    }
  }

  drawSelectedRobot(e) {
    if (this.canEdit) {
      this.saveState();
      this.changeDrawMode(this.PENCIL);

      let selected = document.getElementsByClassName("selected-robot")[0];
      let teamNumber = selected.innerHTML;
      let x = e.touches[0].pageX;
      let y = e.touches[0].pageY - this.canvas_scroll.offsetTop + this.canvasContent.getScrollTop();

      if (selected.classList.contains("red-robot")) {
        this.context.fillStyle = "#ee0002";
      } else {
        this.context.fillStyle = "#2e74eb";
      }

      /* Get the width, in pixels, of the text */
      let textWidth = this.context.measureText(teamNumber).width;
      let width = 40;
      let height = 30;

      this.context.font = "12px arial";
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.fillRect(x - (width/2), y - (height/2), width, height);
      this.context.fillStyle = "#ffffff";
      this.context.fillText(teamNumber, x - (width/2) + (textWidth/4), y);

    }
  }

  drawSelectedImage(e) {
    if (this.canEdit) {
      this.saveState();
      this.changeDrawMode(this.PENCIL);

      let selected = document.getElementsByClassName("selected")[0];
      let selectedImg = selected.querySelector("img");
      let self = this;
      let x = e.touches[0].pageX;
      let y = e.touches[0].pageY - this.canvas_scroll.offsetTop + this.canvasContent.getScrollTop();

      /* Since context is defined within canvas, we replaced it's image with our saved one */
      let img = document.createElement('img');
      img.setAttribute("src", selectedImg.getAttribute("src"));
      img.addEventListener("load", () => {
        console.log(x + " | " + y + " WIDTH/HEIGHT: " + img.width + ", " + img.height);
        let w = img.height * .1;
        let h = img.height * .1;
        self.context.drawImage(img, x - (w/2), y - (h/2), w, h);
      });
    }
  }

  changeDrawMode(ID) {
    switch (ID) {
      case this.PENCIL:
        this.drawingValue = "pencil";
        this.drawingType = this.PENCIL;
        this.context.globalCompositeOperation = "source-over";
        break;
      case this.LINE:
        this.drawingValue = "line";
        this.drawingType = this.LINE;
        break;
      case this.ERASER:
        this.drawingValue = "eraser";
        this.drawingType = this.ERASER;
        this.context.globalCompositeOperation = "destination-out";
        break;
    }
  }

  clearVisiblePalettes() {
    let palettes = document.getElementsByClassName("palette");

    for (let i = 0; i < palettes.length; i++) {
      palettes[i].classList.remove("visible");
      palettes[i].classList.add("hidden");
      palettes[i].setAttribute("style", "transform: translateY(-100%)");
    }

    this.canEdit = true;
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
    let pal = "";

    switch(ID) {
      case this.EDIT:
        e = "draw-menu";
        pal = "draw-palette";
        this.currentMode = this.EDIT;
        break;

      case this.FIELD:
        e = "field-menu";
        pal = "field-palette";
        this.currentMode = this.FIELD;
        break;

      case this.ROBOT:
        e = "robot-menu";
        pal = "robot-palette";
        this.currentMode = this.ROBOT;
        break;

      case this.SAVE:
        e = "save-menu";
        pal = null;
        this.currentMode = null;
        this.confirmSave();
        break;

      case this.OPEN:
        e = "open-menu";
        pal = null;
        this.currentMode = null;
        this.navCtrl.push(OpenFilePage);
        break;

      case this.VIEW:
        e = "view-menu";
        pal = null;
        this.currentMode = this.VIEW;
        // call method
        break;
    }

    let item = document.getElementById(e);
    let palette = null;

    try {
      palette = document.getElementById(pal);
    } catch(e) {
      palette = null;
    }

    if (palette) {
      if (this.isActiveItem(item)) {
        if (this.isItemVisible(palette)) {
          palette.style.transform = "translateY(-100%)";
          palette.classList.remove("visible");
          palette.classList.add("hidden");
          this.canEdit = true;
        } else {
          palette.style.transform = "translateY(" + offset + "px)";
          palette.classList.remove("hidden");
          palette.classList.add("visible");
          this.canEdit = false;
        }
      } else {
        this.resetActiveItems();
        this.clearVisiblePalettes();
        item.classList.add("active-item");
        palette.style.transform = "translateY(" + offset + "px)";
        palette.classList.remove("hidden");
        palette.classList.add("visible");
        this.canEdit = false;
      }
    } else {
      this.resetActiveItems();
      this.clearVisiblePalettes();
      item.classList.add("active-item");
    }


  }

  selectFieldObject(e) {
    let items = document.getElementsByClassName("field-item");
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("selected");
    }
    let item = e.path[1];
    if (!item.classList.contains("field-item-row")) {
      item.classList.add("selected");
    }
    this.togglePalette(this.FIELD);
  }

  selectTeam(e) {
    let robots = document.getElementsByClassName("robot");
    for (let i = 0; i < robots.length; i++) {
      robots[i].classList.remove("selected-robot");
    }

    let robot = e.path[0];
    if (!robot.classList.contains("selected-robot")) {
      robot.classList.add("selected-robot");
    }
    this.togglePalette(this.ROBOT);
  }

  updateBrushSize() {
    document.getElementById("size-val").innerHTML = this.size + "";
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
    this.context.strokeStyle = this.color;
    this.context.fillStyle = this.color;
    document.getElementById("color-val").style.background = this.color;
  }

  clearCanvas() {
    this.saves = [];
    this.redos = [];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}
