const asyncHandler = require("express-async-handler")
const { OAuth2Client } = require("google-auth-library")
const User = require("../modals/User")
const jwt = require("jsonwebtoken")

exports.continueWithGoogle = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { credential } = req.body
    const client = new OAuth2Client({ clientId: process.env.GOOGLE_CLIENT_ID })

    const { payload } = await client.verifyIdToken({ idToken: credential })
    const result = await User.findOne({ email: payload.email })
    if (result) {
        // login
        const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
        res.cookie("travler", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
        res.json({ message: "login Success", result })
    } else {
        // register
        await User.create({
            name: payload.name,
            email: payload.email,
            photo: payload.picture
        })
        const token = jwt.sign({ userId: x._id }, process.env.JWT_KEY, { expiresIn: "1d" })
        res.cookie("travler", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
        res.json({ message: "resgiter Success", result: x })
    }
})