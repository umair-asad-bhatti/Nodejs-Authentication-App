const express = require('express')
const cookieParser = require("cookie-parser")
const dbconnect = require("./database/dbconnect")
const { PORT } = require("./config/envconfig")
const router = require('./routes/index')
const cors = require('cors')
const errorHandler = require("./middleware/errHandle")

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use("/", router)

app.use(errorHandler)//error handler must be at the end


const Server_Port = PORT


const server_setup = async () => {
    await dbconnect();
    app.listen(Server_Port, () => (console.log(`Server is running on port ${Server_Port}`)))
}
server_setup().then(r => console.log("error occurred"))

