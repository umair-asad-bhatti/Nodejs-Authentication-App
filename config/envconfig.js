require("dotenv").config()
const PORT = process.env.PORT
const DB_URI = process.env.DB_URI
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
module.exports = { PORT, DB_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET }