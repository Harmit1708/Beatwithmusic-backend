const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let dbName = "Music";
let dbUrl = `mongodb+srv://Harmit1708:Harmit@cluster0.brz2m.mongodb.net/${dbName}`;
module.exports = { dbUrl, mongodb, MongoClient };
