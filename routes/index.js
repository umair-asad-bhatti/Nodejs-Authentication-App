const express = require('express')
const router = express.Router();
const authController = require("../controller/authController")
//testing
router.get("/test", (req, res) => {
    res.send({ msg: "hello world" }).status(200)
})
//All the routes of the app goes here

//------------users--------------------
//--login
router.post("/login", authController.login)
//--register
router.post('/register', authController.register)
//--logout
//--refresh


//------------------blogs----------------
//create
//read
//update
//delete
//for main page fetch all blogs (show all blogs)
//clicking the blog will open it (show one bolog via id)

//-------------------comments---------------------------
//create comment
//read
module.exports = router 