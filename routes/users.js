var express = require("express");
var router = express.Router();
const { dbUrl, mongodb, MongoClient } = require("../dbConfig");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/addsong", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Music");
    let music = await db
      .collection("song")
      .find({ name: req.body.name })
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 400,
        message: "Song Already Exists",
      });
    } else {
      let addsong = await db.collection("song").insertMany(req.body);
      res.json({
        statusCode: 200,
        message: "Song Add Successful",
        data: addsong,
      });
    }
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

router.get("/songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Music");
    let music = await db.collection("song").find().toArray();
    res.json({
      statusCode: 200,
      data: music,
    });
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
