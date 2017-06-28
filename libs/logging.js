"use strict";

var fs = require('fs');

class Logger {
  /*
    This class units some logging functions - console and logging into file
  */
  constructor(logFileDestination) {
    this.logFileDestination = logFileDestination;
  }

  multiLog(msg) {
    // Log a message (string) to the console and to the file
    console.log(msg);

    /*
      append log data to the destination file if it's already exist,
      otherwise create it
    */
   fs.appendFileSync(this.logFileDestination, `${msg}\n`);
  }
}

module.exports = {
  Logger,
}
