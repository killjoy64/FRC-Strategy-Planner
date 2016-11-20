window.addEventListener("load", () => {
    new Main();
});

class Main {

    constructor() {
        this.initListeners();
    }

    initListeners() {

        let self = this;

        /* Listeners that require a function without parameters */
        document.getElementById("options-toggle").addEventListener("touchstart", () => {
            self.toggleOptionsPalette(self);
        });

        /* Splash screen */
        document.addEventListener('deviceready', () => {
            self.fadeOut(document.getElementById('deviceready'));
        }, false);

        /* Option palette listeners that require a parameter */
        let options = document.getElementsByClassName("palette-item");

        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener("touchstart", () => {
                self.toggleDialog(options[i].dataset.toggle, options[i].id);
            });
        }

        /* Dialog close listeners that require parameters */
        let dialogCloses = document.getElementsByClassName("dialog-close");

        for (let i = 0; i < dialogCloses.length; i++) {
            dialogCloses[i].addEventListener("touchstart", () => {
                self.closeDialog(dialogCloses[i].parentElement);
            });
        }

        /* When a dialog is open, we don't want the body to be scrollable - iOS fix */
        document.getElementsByTagName("body")[0].addEventListener("touchmove", (e) => {
            if (self.getActiveDialog() != null) {
                e.preventDefault();
            }
        });

    }

    toggleOptionsPalette(self) {
        let toggle = document.getElementById("options-toggle").querySelector("span");
        let palette = document.getElementById("options-palette");

        if (palette.classList.contains("options-hidden")) {
            toggle.classList.remove("rotate");
            palette.className = "options-visible";
            if (self.getActiveDialog() != null) {
                self.getActiveDialog().classList.remove("dialog-visible-slide-down");
            }
        } else {
            toggle.classList.add("rotate");
            palette.className = "options-hidden";
            if (self.getActiveDialog() != null) {
                self.getActiveDialog().classList.add("dialog-visible-slide-down");
            }
        }
    }

    toggleDialog(targetDialog, paletteItem) {
        let dialog = document.getElementById(targetDialog);
        let option = document.getElementById(paletteItem);

        if (targetDialog == "menu") {

            let canvas = document.getElementById("canvas");
            let palette = document.getElementById("options-palette");

            /*
            Logic:
                Third, we must make the menu item highlighted
                Fourth, we must literally shift everything...
                    -Slide the menu over
                    -Slide the options palette over
                    -Slide the canvas over
             */

            /* Using raw data for testing because the menu is a special case */
            if (dialog.dataset.visible == "true") {
                // Hide menu

                this.resetActivePaletteItem(option);
                this.slideElementHome(canvas);
                this.slideElementHome(palette);

                dialog.classList.remove("normal");
                dialog.classList.add("menu-slide-left");
                dialog.dataset.visible = "false";

                if (this.getActiveDialog() != null) {
                    this.getActiveDialog().classList.remove("dialog-visible-slide-right");
                }

            } else {
                // Show menu
                this.setActivePaletteItem(option);
                this.slideElementRight(canvas);
                this.slideElementRight(palette);

                dialog.classList.remove("menu-slide-left");
                dialog.classList.add("normal");
                dialog.dataset.visible = "true";

                if (this.getActiveDialog() != null) {
                    this.getActiveDialog().classList.add("dialog-visible-slide-right");
                }

            }

        } else {

            if (targetDialog == "edit") {
                // Put the canvas into editing mode
            }

            if (this.getActiveDialog() == dialog) {
                this.closeDialog(this.getActiveDialog());
                this.resetActivePaletteItem(this.getActivePaletteItem());
                this.setCanvasMode(null);
            } else if (this.getActivePaletteItem() == option) {
                this.resetActivePaletteItem(this.getActivePaletteItem());
                this.setCanvasMode(null);
            } else {
                if (this.getActiveDialog() != null) {
                    this.closeDialog(this.getActiveDialog());
                }

                if (this.getActivePaletteItem() != null) {
                    this.resetActivePaletteItem(this.getActivePaletteItem());
                }

                this.setActivePaletteItem(option);
                this.openDialog(dialog);
                this.setCanvasMode(targetDialog);
            }

        }
    }

    setCanvasMode(mode) {
        if (mode == null) {
            document.getElementById("actual-canvas").dataset.mode = "view";
        } else {
            document.getElementById("actual-canvas").dataset.mode = mode;
        }
    }

    slideElementRight(e) {
        e.classList.remove("normal");
        e.classList.add("slide-right");
    }

    slideElementHome(e) {
        e.classList.remove("slide-right");
        e.classList.add("normal");
    }

    openDialog(dialog) {
        dialog.dataset.visible = "true";

        dialog.classList.add("dialog-visible");
        dialog.classList.remove("dialog-hidden");

        document.getElementsByTagName("body")[0].classList.remove("show-y");
        document.getElementsByTagName("body")[0].classList.add("hide-y");
    }

    closeDialog(dialog) {
        dialog.dataset.visible = "false";

        if (dialog.classList.contains("dialog-visible-slide-down")) {
            dialog.classList.remove("dialog-visible-slide-down");
        }

        dialog.classList.remove("dialog-visible");
        dialog.classList.add("dialog-hidden");

        document.getElementsByTagName("body")[0].classList.add("show-y");
        document.getElementsByTagName("body")[0].classList.remove("hide-y");
    }

    resetActivePaletteItem(e) {
        e.classList.remove("active-palette-item");
    }

    setActivePaletteItem(e) {
        e.classList.add("active-palette-item");
    }

    getActivePaletteItem() {
        let options = document.getElementsByClassName("palette-item");

        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains("active-palette-item")) {
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

    getPaletteItemTarget(paletteItem) {
        return document.getElementById(paletteItem.dataset.target);
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