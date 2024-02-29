const jwt = require("jsonwebtoken")
const RefreshToken = require("../models/token")
const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = require("../config/envconfig")
const { login } = require("../controller/authController")
class JWTService {

    //CREATE ACCESS TOKEN
    static signAccessToken(payload, expiryTime) {
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiryTime })
    }
    //CREATE REFRESH TOKEN
    static signRefreshToken(payload, expiryTime) {
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: expiryTime })
    }
    //verify access token
    static verifyAccessToken(token) {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    }
    //verify refresh token
    static verifyRefreshToken(token) {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    }
    static async storeRefreshToken(token, userId) {
        try {
            const newToken = new RefreshToken({
                token,
                userId
            })
            await newToken.save()

        } catch (error) {
            console.log("error storing access token");
        }
    }

}
module.exports = JWTService