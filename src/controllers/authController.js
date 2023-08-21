const User = require("../models/Users")
const bcrypt = require("bcrypt")
const validator = require("validator")

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
        const existingUserWithEmail = await User.findOne({ where: { email: email } })
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
            return res.status(200).json({ message: "New User created successfully", user_id: newUser.id, full_name: newUser.full_name, email: newUser.email, folders: newUser.folders, isAdmin: newUser.isAdmin })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }

}


module.exports.getMyUser_get = async (req, res) => {
    try {
        const user = req.currentUser
        return res.status(200).json({ user_id: user.id, full_name: user.full_name, email: user.email, folders: user.folders, isAdmin: user.isAdmin })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error" })
    }

}

module.exports.logout_post = async (req, res) => {
    try {
        const user = req.currentUser
        if (user) {
            req.session.destroy()
            return res.status(200).json({ message: "Logged out successfully" })
        }
        return res.status(200).json({ message: "Logged out successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error" })
    }
}

