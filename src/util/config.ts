export class Config {

  public static VERSION: string = "2.9.4";

  /* Controls whether the device is the browser. Disables native features if it is. */
  public static IS_BROWSER: boolean = true;

  /* Controls whether we are debugging the application. Changes event dates and AngularJS enableProdMode() */
  public static DEBUG: boolean = false;

  public static TEAM_NUMBER: number = null;

  constructor() {}

  public static getJSON() {
    return {
      "team_number": this.TEAM_NUMBER
    };
  }

}
