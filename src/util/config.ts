/**
 * Created by Kyle Flynn on 1/25/2017.
 */

export class Config {

  public static VERSION: string = "3.0.0";

  public static IS_BROWSER: boolean = false;
  public static DEBUG_MODE: boolean = false;
  public static TEAM_NUMBER: number = null;

  public static FIREBASE_USER: any = null;

  public static getJSON() {
    return {
      "team_number": this.TEAM_NUMBER
    };
  }

}
