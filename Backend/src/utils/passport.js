require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { userID } = require("../services/userID");
const { createUser } = require("../services/createUser");

passport.use(
  new GoogleStrategy(
    {
      clientID: AppConfig.GOOGLE_CLIENTID,
      clientSecret: AppConfig.GOOGLE_SECRET_KEY,
      callbackURL: `${AppConfig.HOST}/api/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
      const email = profile._json.email;
      const { id, displayName, provider } = profile;
      const user_id = await userID(id);
      if (!user_id) {
        const user = await createUser({
          fullName: displayName,
          email: email,
          _id: id,
        });
      }
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
