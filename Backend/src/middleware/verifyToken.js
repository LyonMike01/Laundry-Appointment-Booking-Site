const jwt = require("jsonwebtoken");

const config = process.env;

exports.verifyToken = (req, res, next) => {

  try {
    const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    const decoded = jwt.verify(token, AppConfig.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
  } 
  else {
    return res.status(403).send("A token is required for authentication");
  }
    
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

