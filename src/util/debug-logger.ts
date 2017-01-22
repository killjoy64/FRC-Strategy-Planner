export class DebugLogger {

  private static logString: string;

  public static init() {
    this.logString = "";
  }

  public static log(level, message) {
    console.log(this.toString(level) + message);
    this.logString += this.toString(level) + message + "<br/>";
  }

  public static getLogs() {
    return this.logString;
  }

  private static toString(type) {
    if (type == LoggerLevel.INFO) {
      return "[INFO]: ";
    } else if (type == LoggerLevel.WARN) {
      return "[WARN]: ";
    } else if (type == LoggerLevel.ERROR) {
      return "[ERROR]: ";
    } else {
      return "[UNDEFINED]: ";
    }
  }

}

export class LoggerLevel {

  static INFO: number = 1;
  static WARN: number = 2;
  static ERROR: number = 3;

}
