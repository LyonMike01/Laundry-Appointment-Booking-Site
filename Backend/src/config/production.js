require("dotenv").config();

exports.production = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  DATABASE: process.env.DATABASE,
  JWT_SECRET: process.env.JWT_SECRET,
  SECRET: process.env.SECRET,
  GOOGLE_CLIENTID: process.env.GOOGLE_CLIENTID,
  GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY,
};
