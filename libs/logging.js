"use strict";

var fs = require('fs');

class Logger {
  constructor(logFileDestination) {
    this.logFileDestination = logFileDestination;
    this.textToLog = "";
    this.open = true;
  }

  multiLog(msg) {
    if (!this.open) {
      throw new Error("The logger isn't opened!");
    }
    console.log(msg);
    this.textToLog += msg;
  }

  endLogging() {
    this.open = false;
    fs.writeFileSync(this.logFileDestination, this.textToLog);
  }
}

module.exports = {
  Logger,
}
