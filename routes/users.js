var express = require("express");
var router = express.Router();
const { dbUrl, mongodb, MongoClient } = require("../dbConfig");
var {hashPassword, hashCompare,createToken,verifyToken} = require("../Authentication");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let db = await client.db("Music");
    let user = await db.collection("users").find({ email: req.body.email });
    if (user.length > 0) {
      res.json({
        statusCode: 400,
        message: "User Already Exists",
      });
    } else {
      let hashedPassword = await hashPassword(req.body.password,req.body.cpassword);
      req.body.password= hashedPassword;
      req.body.cpassword = hashedPassword;

      let user = await db.collection("users").insertOne(req.body);
      res.json({
        statusCode: 200,
        message: "User SignUp Successfull",
      }); 
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  } finally {
    client.close();
  }
});



router.post("/login", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let db = await client.db("Music");
    let user = await db.collection("users").findOne({ email: req.body.email });
    if (user) {
      let compare = await hashCompare(req.body.password, user.password);
      if (compare) {
        let token  = await createToken(user.email,user.firstName,user.role  )
        res.json({
          statusCode: 200,
          role:user.role, 
          email: user.email,
          firstName: user.firstName,  
          token
        });
      } else {
        res.json({
          statusCode: 400,
          message: "Invalid Password",
        });
      }
    } else {
      res.json({
        statusCode: 404,
        message: "User Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  } finally {
    client.close();
  }
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


router.post("/auth",verifyToken,async(req,res)=>{
  res.json({
    statusCode:200,
    message:req.body.purpose
  })
})

module.exports = router;
