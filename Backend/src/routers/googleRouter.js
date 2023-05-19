require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const createUser = require("../services/createUser");

router.get("/login/success", async (req, res) => {
  if (req.user) {
    const token = jwt.sign({ userId: req.user.id }, AppConfig.JWT_SECRET, {
      expiresIn: "1hr",
    });
    res.status(200).json({
      error: false,
      token: token,
      message: "Successfully Loged In",
      userId: req.user.id,
      userName: req.user.displayName,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/", passport.authenticate("google", ["profile", "email"]));
// router.get("/google", );

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/google/login/success",
    failureRedirect: "/api/auth/google/login/failed",
  })
);

module.exports = router;
