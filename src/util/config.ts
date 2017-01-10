export class Config {

  public static VERSION: string = "2.7.0";

  public static IS_BROWSER: boolean = true;
  public static TEAM_NUMBER: number = null;
  public static DEBUG: boolean = false;

  constructor() {}

  public static getJSON() {
    return {
      "team_number": this.TEAM_NUMBER
    };
  }

}
