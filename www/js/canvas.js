window.addEventListener("load", () => {
   new Canvas();
});

class Canvas {

    constructor() {

        /* Setting up our canvas variables */
        this.canvas_container = document.getElementById("canvas");
        this.canvas = this.canvas_container.querySelector("canvas");
        this.context = this.canvas.getContext("2d");

        /* Default properties for our canvas */
        this.canvas.setAttribute("width", this.canvas_container.clientWidth + "");
        this.canvas.setAttribute("height", this.canvas_container.clientHeight + "");

        this.context.strokeStyle = "#000000";
        this.context.fillStyle = "#000000";
        this.context.scale(1.0, 1.0);

        /* Initialize our drawing variables */
        this.size = 1;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.style = 0; // 0 will be line | 1 will be free | 2 will be eraser
        this.mode = "NULL";
        this.drawing = false;
        this.saves = [];
        this.redos = [];

        /* Make sure our values init */
        this.setBrushSize();
        this.setColorR();
        this.setColorG();
        this.setColorB();
        this.updateColor();
        this.updateMode();
        this.setToFreeStyle();

        /* Initialize all of our editable parameters */
        this.initListeners();
    }

    initListeners() {
        let self = this;

        document.getElementById("brush-size").addEventListener("input", self.setBrushSize);
        document.getElementById("brush-color-r").addEventListener("input", () => {
            self.setColorR();
            self.updateColor();
        });
        document.getElementById("brush-color-g").addEventListener("input", () => {
            self.setColorG();
            self.updateColor();
        });
        document.getElementById("brush-color-b").addEventListener("input", () => {
            self.setColorB();
            self.updateColor();
        });
        document.getElementById("brush-style-line").addEventListener("touchstart", () => {
            self.setToLineStyle();
        });
        document.getElementById("brush-style-free").addEventListener("touchstart", () => {
            self.setToFreeStyle();
        });
        document.getElementById("brush-style-eraser").addEventListener("touchstart", () => {
            self.setToEraserStyle();
        });
        document.getElementById("undo").addEventListener("touchstart", () => {
            self.undo();
        });
        document.getElementById("redo").addEventListener("touchstart", () => {
            self.redo();
        });

        self.canvas.addEventListener("touchstart", (e) => {
            self.updateMode();
            self.beginDrawing(e);
        });

        self.canvas.addEventListener("touchmove", (e) => {
            self.updateMode();
            self.drawPoint(e);
        });

        self.canvas.addEventListener("touchend", (e) => {
            self.updateMode();
            self.endDrawing(e);
        });
    }

    undo() {
        this.context.globalCompositeOperation = "source-over";
        if (this.saves.length > 0) {
            let self = this;
            let undo = self.saves.pop();
            let img = document.createElement('img');
            img.setAttribute("src", undo);
            img.addEventListener("load", () => {
                self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
                self.context.drawImage(img, 0, 0);
            });
            self.redos.push(undo);
        } else {
            this.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        }
    }

    redo() {
        this.context.globalCompositeOperation = "source-over";
        if (this.redos.length > 0) {
            let self = this;
            let redo = self.redos.pop();
            let img = document.createElement('img');
            img.setAttribute("src", redo);
            img.addEventListener("load", () => {
                self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
                self.context.drawImage(img, 0, 0);
            });
            self.saves.push(redo);
        }
    }

    updateMode() {
        this.mode = document.getElementById("actual-canvas").dataset.mode;
    }

    updateColor() {
        let color = "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
        document.getElementById("brush-color").style.backgroundColor = color;
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
    }

    setBrushSize() {
        let val = document.getElementById("brush-size").value;
        document.getElementById("brush-val").innerHTML = val;
        this.size = val;
    }

    setColorR() {
        let val = document.getElementById("brush-color-r").value;
        document.getElementById("brush-color-r-val").innerHTML = val;
        this.r = val;
    }

    setColorG() {
        let val = document.getElementById("brush-color-g").value;
        document.getElementById("brush-color-g-val").innerHTML = val;
        this.g = val;
    }

    setColorB() {
        let val = document.getElementById("brush-color-b").value;
        document.getElementById("brush-color-b-val").innerHTML = val;
        this.b = val;
    }

    setToLineStyle() {
        this.style = 0;
        document.getElementById("brush-style").innerHTML = "Line";
    }

    setToFreeStyle() {
        this.style = 1;
        document.getElementById("brush-style").innerHTML = "Free";
    }

    setToEraserStyle() {
        this.style = 2;
        document.getElementById("brush-style").innerHTML = "Eraser";
    }

    checkLineStyle() {
        const LINE = 0;
        const PENCIL = 1;
        const ERASE = 2;

        if (this.style == PENCIL) {
            this.context.globalCompositeOperation = "source-over";
        }
        if (this.style == LINE) {

        }
        if (this.style == ERASE) {
            this.context.globalCompositeOperation = "destination-out";
        }
    }

    drawPoint(e) {
        if (this.mode == "edit") {
            if (this.drawing && this.getActiveDialog() == null && !this.isMenuActive()) {
                this.setBrushSize();
                this.checkLineStyle();
                e.preventDefault();
                let x = e.touches[0].pageX;
                let y = e.touches[0].pageY - this.canvas.offsetTop;
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
    }

    saveState() {
        this.saves.push(this.canvas.toDataURL());
    }

    beginDrawing(e) {
        this.saveState();
        this.drawing = true;
        this.drawPoint(e);
    }

    endDrawing(e) {
        this.drawing = false;
        this.context.beginPath();
    }

    isMenuActive() {
        return document.getElementById("menu").classList.contains("normal");
    }

    getActiveDialog() {
        let dialogs = document.getElementsByClassName("dialog");

        for (let i = 0; i < dialogs.length; i++) {
            if (dialogs[i].dataset.visible == "true") {
                return dialogs[i];
            }
        }
        return null;
    }

}