const mongoose = require("mongoose")
const { DB_URI } = require("../config/envconfig")
const Database_connection_string = DB_URI
const dbconnect = async () => {

    try {
        await mongoose.connect(Database_connection_string)
        console.log("connected to bd");

    } catch (error) {
        console.log(`db connection error ${error}`);
    }

}
module.exports = dbconnect