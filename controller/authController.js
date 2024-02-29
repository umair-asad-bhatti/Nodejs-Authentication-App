const Joi = require('joi');
const userDto = require("../dto/user")
const RefreshToken = require("../models/token")
const User = require("../models/user")
const bcryptjs = require('bcryptjs')
const JWTService = require("../services/JWTService")
const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_])(?=.*[a-z]).{8,}$/;
const authController = {
    login: async function (req, res, next) {
        const { email, password } = req.body;
        //1. check if user with email exists or not if not exits return err
        //2. compare the password with password in database other wise return error
        let alreadyRegisteredUser;
        try {
            alreadyRegisteredUser = await User.findOne({ email })
            if (!alreadyRegisteredUser) {
                const error = {
                    status: 401,
                    message: "invalid email"
                }
                return next(error)
            }
            const match = await bcryptjs.compare(password, alreadyRegisteredUser.password)
            if (!match) {
                const error = {
                    status: 401,
                    message: "invalid password"
                }
                return next(error)
            }

        } catch (error) {
            return next(error)
        }
        //access token and refresh token
        let accessToken;
        let refreshToken;
        accessToken = JWTService.signAccessToken({ _id: alreadyRegisteredUser._id }, '30m')
        accessToken = JWTService.signRefreshToken({ _id: alreadyRegisteredUser._id }, '60m')
        //update refresh token in db
        try {

            await RefreshToken.
                updateOne(
                    { _id: alreadyRegisteredUser._id },
                    { token: refreshToken },
                    { upsert: true })
        } catch (error) {
            return next(error)
        }

        //4. send response
        res.cookie(accessToken, { maxAge: '1000*60*60*24', httpOnly: true })
        res.cookie(refreshToken, { maxAge: '1000*60*60*24', httpOnly: true })
        const user_dto = new userDto(alreadyRegisteredUser)
        return res.json({ user: user_dto }).status(200)

    },

    register: async function (req, res, next) {

        //1. validate the inputs
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(3).max(10).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordRegex).required(),
        })
        //2. if error in validation->return error via middleware
        const { error } = userRegisterSchema.validate(req.body)
        if (error) {
            return next(error)
        }
        //3. if email or password already exists->return err
        const { username, email, name, password } = req.body;
        try {
            const emailInUse = await User.exists({ email })
            const usernameInUse = await User.exists({ username })
            if (emailInUse) {
                const error = {
                    status: 409,
                    message: "email already exists! use other email"
                }
                return next(error)
            }
            if (usernameInUse) {
                const error = {
                    status: 409,
                    message: "username not available! use other username"
                }
                return next(error)
            }
        } catch (error) {
            return next(error)
        }
        //4. hash password
        let hashedPassword = await bcryptjs.hash(password, 10)
        hashedPassword = hashedPassword.toString()
        //5.store the data in db
        let accessToken;
        let refreshToken;
        let user;
        try {

            const userToRegister = new User({
                username, name, email, password: hashedPassword
            })
            user = await userToRegister.save();
            accessToken = JWTService.signAccessToken({ _id: user._id, username: user.email }, '30m')
            refreshToken = JWTService.signRefreshToken({ _id: user._id, username: user.email }, '7d')

        } catch (error) {
            return next(error)
        }

        //store refresh token in db
        await JWTService.storeRefreshToken(refreshToken, user._id)

        res.cookie('accesstoken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true  //one day time expiry for cookie
        })
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true  //one day time expiry for cookie
        })
        //6. send response
        const user_dto = new userDto(user)
        return res.status(201).json({ user: user_dto });
    }
}
module.exports = authController;