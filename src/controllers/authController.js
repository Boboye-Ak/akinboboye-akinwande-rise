const User = require("../models/Users")
const bcrypt = require("bcrypt")
const validator = require("validator")
const passport = require("passport")
module.exports.signup_post = async (req, res) => {
    // #swagger.description = 'Endpoint for users to signup'
    try {
        const { full_name, email, password } = req.body
        if (!full_name || !email || !password) {
            return res.status(400).json({ message: "Please enter full name, email and password" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" })
        }
        const existingUserWithEmail = await User.findOne({ email: email })
        if (existingUserWithEmail) {
            return res.status(409).json({ message: "User with this email already exists" })
        }
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({
            email: email,
            full_name: full_name,
            password: hashedPassword
        })
        req.logIn(newUser, async (err) => {
            if (err) throw err
            return res.status(200).json({ message: "New User created successfully", user_id: newUser.id, full_name: newUser.full_name, email: newUser.email })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }

}

module.exports.login_post = (req, res, next) => {
    // #swagger.description = 'Endpoint for users to login'
    passport.authenticate("local", (err, user, info) => {
        console.log(user)
        if (err) throw err
        if (!user)
            res.status(404).json({ message: "Could not login. Check email address and password", status: 404 })
        else {
            req.logIn(user, (err) => {
                if (err) throw err
                console.log(req.user)
                res.status(200).json({ message: "Successfully Authenticated", status: 200 })
            })
        }
    })
}