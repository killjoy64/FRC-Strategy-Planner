export class Style {

  public static translateX(id, dir) {

    return new Promise((resolve) => {
      document.getElementById(id).style.transform = "translateX(" + dir + "%)";
      document.getElementById(id).addEventListener("transitionend", () => {
        resolve();
      });
    });

  }

  public static translateY(id, dir) {
    return new Promise((resolve) => {
      document.getElementById(id).style.transform = "translateY(" + dir + "%)";
      document.getElementById(id).addEventListener("transitionend", () => {
        resolve();
      });
    });
  }

  public static fadeOut(id) {

    return new Promise((resolve) => {
      document.getElementById(id).classList.remove("visible");
      document.getElementById(id).classList.add("hidden");
      document.getElementById(id).addEventListener("transitionend", () => {
        document.getElementById(id).style.display = "none";
        setTimeout(() => {
          resolve();
        }, 250);
      });
    });

  }

  public static fadeIn(id) {
    document.getElementById(id).style.display = "block";
    return new Promise((resolve) => {
      document.getElementById(id).classList.remove("hidden");
      document.getElementById(id).classList.add("visible");
      document.getElementById(id).addEventListener("transitionend", () => {
        setTimeout(() => {
          resolve();
        }, 250);
      });
    });
  }

}
