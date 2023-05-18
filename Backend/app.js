require("dotenv").config()
require("./src/config") // load config
require("./src/db/mongodb") // load database
const express = require("express"),
      bodyParser = require("body-parser"),
      userRoute = require("./src/routers/userRouter"),
      jwt = require("jsonwebtoken"),
      {cors} = require("./src/utils/cors");

 app = express(),


 //console.log(dotenv.parsed);


// middleware for expired token
app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
     const accessToken = req.headers["x-access-token"];
     const { exp } = await jwt.verify(accessToken, AppConfig.JWT_SECRET);
     // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
       error: "JWT token has expired, please login to obtain a new one"
      });
     }
     next();
    } else {
     next();
    }
});


app.use(express.json())
    .use(cors) // loaded cors
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use("/api", userRoute)
    .get("/api", (req, res) => {
        res.send("Everything works pretty well 🚀, Welocome please head over to the User route and create an account with us");
      })
    .get("*", (req, res) => {
      res.status(404).json({
          status: "failed",
          message: "Not Found",
          data: "Route does not exist"
      })
      })
    .listen(AppConfig.PORT, () => {
      console.log(`App is running on port ${AppConfig.PORT}`) // launch express app
      })


  module.exports = app