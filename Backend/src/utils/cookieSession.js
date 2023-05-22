const cookieSession = require("cookie-session");

module.exports = cookieSession({
  name: "session",
  keys: [AppConfig.JWT_SECRET],
  maxAge: 24 * 60 * 60 * 1000,
});
