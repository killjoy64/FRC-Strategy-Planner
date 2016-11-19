window.addEventListener("load", () => {
    new Main();
});

class Main {

    constructor() {
        this.hiddenOptions = false;
        this.drawing = false;
        this.dragging = false;

        document.addEventListener('deviceready', () => {
            this.onDeviceReady();
        }, false);

        document.getElementById("options-toggle").addEventListener("touchstart", () => {
            this.toggleOptions();
        });

        let options = document.getElementsByClassName("palette-option");

        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener("touchstart", () => {
               this.toggleDialog(options[i].dataset.toggle, options[i].id);
            });
        }

        let dialogCloses = document.getElementsByClassName("dialog-close");

        for (let i = 0; i < dialogCloses.length; i++) {
            dialogCloses[i].addEventListener("touchstart", () => {
               this.hideDialog(dialogCloses[i].parentElement);
            });
        }

        this.canvas_container = document.getElementById("canvas");
        this.canvas = document.getElementById("actual-canvas");
        this.context = this.canvas.getContext("2d");

        this.canvas.setAttribute("width", this.canvas_container.clientWidth + "");
        this.canvas.setAttribute("height", this.canvas_container.clientHeight + "");

        this.context.strokeStyle = "#000000";
        this.context.fillStyle = "#000000";
        this.context.scale(1.0, 1.0);

        this.canvas.addEventListener("touchstart", (e) => {
            this.beginDrawing(e);
        });

        this.canvas.addEventListener("touchmove", (e) => {
            this.drawPoint(e);
        });

        this.canvas.addEventListener("touchend", (e) => {
            this.endDrawing(e);
        });

        console.log("STM Custom Script Initialized");
    }

    onDeviceReady() {
        let parentElement = document.getElementById('deviceready');

        this.fadeOut(parentElement);
    }

    toggleOptions() {
        let toggle = document.getElementById("options-toggle").querySelector("span");
        let palette = document.getElementById("options-palette");

        if (this.hiddenOptions) {
            toggle.classList.remove("rotate");
            palette.className = "options-shown";
            this.hiddenOptions = false;
        } else {
            toggle.classList.add("rotate");
            palette.className = "options-hidden";
            this.hiddenOptions = true;
        }
    }

        toggleDialog(target, originID) {
            let dialog = document.getElementById(target);
            let origin = document.getElementById(originID);

            if (target == "menu") {
                let canvas = document.getElementById("canvas");
                let palette = document.getElementById("options-palette");
                if (dialog.dataset.visible == "true") {
                    dialog.dataset.visible = "false";

                    dialog.classList.remove("normal");
                    dialog.classList.add("menu-shifted");

                    canvas.classList.add("normal");
                    canvas.classList.remove("shifted");

                    this.resetOptions(this.getActiveDialogButton());
                    origin.classList.remove("active-menu-dialog");

                    if (this.activeDialog()) {
                        this.getActiveDialog().classList.remove("dialog-shown-shifted");
                    }

                    palette.className = "normal";
                } else if (dialog.dataset.visible == "false") {
                    dialog.dataset.visible = "true";

                    dialog.classList.add("normal");
                    dialog.classList.remove("menu-shifted");

                    canvas.classList.remove("normal");
                    canvas.classList.add("shifted");

                    this.resetOptions(this.getActiveDialogButton());
                    origin.classList.add("active-menu-dialog");

                    if (this.activeDialog()) {
                        this.getActiveDialog().classList.add("dialog-shown-shifted");
                    }

                    palette.className = "shifted";
                }
            } else {
                if (dialog.dataset.visible == "true") {
                    dialog.dataset.visible = "false";
                    this.resetAllOptions();
                    origin.classList.remove("active-dialog");
                    this.resetDialog(dialog);
                    dialog.classList.add("dialog-hidden");
                    dialog.classList.remove("dialog-shown");
                } else if (dialog.dataset.visible == "false") {
                    dialog.dataset.visible = "true";
                    this.resetAllOptions();
                    origin.classList.add("active-dialog");
                    this.resetDialog(dialog);
                    dialog.classList.remove("dialog-hidden");
                    dialog.classList.add("dialog-shown");
                }

                if (target == "edit") {
                    if (this.drawing) {
                        this.drawing = false;
                    } else {
                        this.drawing = true;
                    }
                }

            }
        }

    resetAllOptions() {
        let options = document.getElementsByClassName("palette-option");

        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains("active-dialog")) {
                options[i].classList.remove("active-dialog");
            }
        }
    }

    resetOptions(exception1) {
        let options = document.getElementsByClassName("palette-option");

        for (let i = 0; i < options.length; i++) {
            if (exception1 != null) {
                if (options[i].id != exception1.id) {
                    if (options[i].classList.contains("active-dialog")) {
                        options[i].classList.remove("active-dialog");
                    }
                }
            } else {
                if (options[i].classList.contains("active-dialog")) {
                    options[i].classList.remove("active-dialog");
                }
            }
        }
    }

    resetDialog(exception1) {
        let dialogs = document.getElementsByClassName("dialog");

        for (let i = 0; i < dialogs.length; i++) {
            if (dialogs[i].id != exception1.id) {
                dialogs[i].dataset.visible = "false";
                dialogs[i].classList.add("dialog-hidden");
                dialogs[i].classList.remove("dialog-shown");
            }
        }
    }

    activeDialog() {
        let dialogs = document.getElementsByClassName("dialog");

        for (let i = 0; i < dialogs.length; i++) {
            if (dialogs[i].dataset.visible == "true") {
                return true;
            }
        }

        return false;
    }

    getActiveDialogButton() {
        let options = document.getElementsByClassName("palette-option");

        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains("active-dialog")) {
                return options[i];
            }
        }
        return null;
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

    hideDialog(dialog) {
        dialog.classList.remove("dialog-shown");
        dialog.classList.add("dialog-hidden");
    }

    drawPoint(e) {
        if (this.drawing && this.dragging) {
            e.preventDefault();
            let x = e.touches[0].pageX;
            let y = e.touches[0].pageY - this.canvas.offsetTop;
            let r = document.getElementById("brush-size").value;
            this.context.lineTo(x, y);
            this.context.stroke();
            this.context.beginPath();
            this.context.arc(x, y, r, 0, Math.PI*2);
            this.context.fill();
            this.context.beginPath();
            this.context.moveTo(x, y);
        }
    }

    beginDrawing(e) {
        this.dragging = true;
        this.drawPoint(e);
    }

    endDrawing(e) {
        this.dragging = false;
        this.context.beginPath();
    }

    slide(e, start, end, axis, transposition, time) {
        let curPos = start;
        let pos = start;
        let ticks = 0;
        let distance = Math.abs(start - end);
        let slide = setInterval(() => {

            if (end > start) {
                if (curPos >= end) {
                    e.style.transform = "translate" + axis + "(" + end + "%)";
                    clearInterval(slide);
                }
            } else {
                if (curPos <= end) {
                    e.style.transform = "translate" + axis + "(" + end + "%)";
                    clearInterval(slide);
                }
            }

            let interpolation = this.transition(0, time, ticks);

            pos = transposition + (distance * interpolation);

            if (end > start) {
                curPos = pos;
            } else {
                if (start < 0) {
                    curPos = (start + pos);
                } else {
                    curPos = (start - pos);
                }
            }

            e.style.transform = "translate" + axis + "(" + curPos + "%)";

            ticks++;
        }, 0);
    }

    transition(start, end, point) {
        if(point <= start) { return 0; }
        if(point >= end) { return 1; }
        let x = (point - start) / (end - start);
        return x*x*(3 - 2*x);
    }

    fadeIn(elem) {
        let opacity = 0.001;

        let fadeEffect = setInterval(() => {
            if (elem.style.opacity >= 1) {
                elem.style.opacity = 1.0;
                clearInterval(fadeEffect);
            }
            elem.style.opacity = Math.sqrt(opacity);
            opacity += 0.002;
        }, 0);
    }

    fadeOut(elem) {
        let opacity = 1.0;

        let fadeEffect = setInterval(() => {
            elem.style.opacity = opacity;
            opacity -= 0.010;
            if (elem.style.opacity <= 0.0) {
                elem.style.opacity = 0.0;
                elem.style.display = "none";
                clearInterval(fadeEffect);
            }
        }, 0);
    }

}