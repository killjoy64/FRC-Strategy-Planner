export class Style {

  public static fadeOut(id) {

    return new Promise((resolve) => {
      document.getElementById(id).classList.remove("visible");
      document.getElementById(id).classList.add("hidden");
      document.getElementById(id).addEventListener("transitionend", () => {
        document.getElementById(id).style.display = "none";
        resolve();
      });
    });

  }

  public static fadeIn(id) {
    return new Promise((resolve) => {
      document.getElementById(id).style.display = "block";
      document.getElementById(id).classList.remove("hidden");
      document.getElementById(id).classList.add("visible");
      document.getElementById(id).addEventListener("transitionend", () => {
        resolve();
      });
    });
  }

}
