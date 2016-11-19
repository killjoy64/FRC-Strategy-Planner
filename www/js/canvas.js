window.addEventListener("load", () => {
   new Canvas();
});

class Canvas {

    constructor() {

        /* Setting up our canvas variables */
        this.canvas_container = document.getElementById("canvas");
        this.canvas = this.canvas_container.querySelector("canvas");
        this.context = this.canvas.getContext("2d");

        /* Initialize our drawing variables */
        this.size = 1;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.style = 0; // 0 will be line | 1 will be free

        /* Make sure our values init */
        this.setBrushSize();
        this.setColorR();
        this.setColorG();
        this.setColorB();
        this.updateColor();

        /* Initialize all of our editable parameters */
        this.initListeners();
    }

    initListeners() {
        let self = this;

        document.getElementById("brush-size").addEventListener("input", this.setBrushSize);
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
        document.getElementById("brush-style-line").addEventListener("click", () => {
            self.setToLineStyle();
        });
        document.getElementById("brush-style-free").addEventListener("click", () => {
            self.setToFreeStyle();
        });
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
    }

    setToFreeStyle() {
        this.style = 1;
    }

}