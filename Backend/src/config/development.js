
require("dotenv").config()

exports.development = {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    DATABASE: process.env.DATABASE,
    JWT_SECRET: process.env.JWT_SECRET,
    SECRET: process.env.SECRET
}
