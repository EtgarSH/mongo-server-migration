var Promise = require('bluebird');

var mongodb = require('mongodb');

var fs = require('fs');

var config = require('./config');

var Logger = require('./libs/logging').Logger;
var logger = new Logger("./error.log")

var srcClient = mongodb.MongoClient();
var dstClient = mongodb.MongoClient();

// TODO - Put the close and endlogging functions somewhere
srcClient.connect(config.SERVER_CONSTANTS.sourceUrl, (err, srcDb) => {
  if (err) {
    logger.multiLog(`Couldn't connect to ${config.SERVER_CONSTANTS.sourceUrl}: ${err}`);
  } else {
    dstClient.connect(config.SERVER_CONSTANTS.destinationUrl, (err, destDb) => {
      if (err) {
        logger.multiLog(`Couldn't connect to ${config.SERVER_CONSTANTS.destinationUrl}: ${err}`);
        logger.endLogging();
        srcDb.close();
      }

      else {
        srcDb.collections((err, srcCollections) => {
          if (err) {
            logger.multiLog(`Couldn't fetch collections from the source server!: ${err}`);
            logger.endLogging()
            srcDb.close();
            destDb.close();
          } else {
            var promises = [];
            srcCollections.forEach((srcCollection) => {
              logger.multiLog(`Transfering Collection: ${srcCollection.collectionName}`);

              var dstCollection = destDb.collection(srcCollection.collectionName);

              promises.push(srcCollection.find({}, (err, cursor) => {
                if (err) {
                  logger.multiLog(`Couldnt find documents of ${srcCollection.collectionName}:  ${err}`);

                } else {
                  cursor.toArray = Promise.promisify(cursor.toArray);
                  promises.push(cursor.toArray((err, documents) => {
                    dstCollection.insertMany(documents);
                  }));
                }
              }));
            });
            logger.endLogging();
            srcDb.close();
            destDb.close();
          }
        });
      }
    });
  }
});
