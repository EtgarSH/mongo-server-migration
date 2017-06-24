var MongoClient = require('mongodb').MongoClient
var fs = require('fs');

const url = "mongodb://localhost:27017/shout";
const backupFolder = "./Backup";

var writeToErrorLogs = "";

MongoClient.connect(url, (err, db) => {
  if (!err) {
    fs.readdirSync(backupFolder).forEach((file) => {
      var content = fs.readFileSync(`${backupFolder}/${file}`, 'utf8');
      var documentsStrings = content.split('\n');
      var documents = [];

      documentsStrings.forEach((document) => {
        try {
          documents.push(JSON.parse(document));
        } catch (error) {
          console.log(`Couldn't parse ${document}`)
          writeToErrorLogs += `File: ${file}: ${document}\n`;
        }
      });

      console.log(documents)

      var collection = db.collection(file.split('.')[0]);
      collection.insertMany(documents);
    });

    db.close();
    fs.writeFileSync('errors.log', writeToErrorLogs);

  } else {
    console.error(err);
  }
})
