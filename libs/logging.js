"use strict";

var fs = require('fs');

class Logger {
  /*
    This class units some logging functions - console and logging into file
  */
  constructor(logFileDestination) {
    this.logFileDestination = logFileDestination;
    this.textToLog = "";
    this.open = true;
  }

  multiLog(msg) {
    // Log a message (string) to the console and to the file

    if (!this.open) {
      throw new Error("The logger isn't opened!");
    }
    console.log(msg);
    this.textToLog += `${msg}\n`;
  }

  endLogging() {
    /*
      Saves the log file
      You cannot usק this class instance anymore after you end the logging
    */

    this.open = false;
    fs.writeFileSync(this.logFileDestination, this.textToLog);
  }
}

module.exports = {
  Logger,
}
