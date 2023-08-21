const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/Users")

const localStrategy = new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
        console.log("trying to login")
        try {
            console.log("trying local strategy")
            const user = await User.findOne({ email: username })
            if (!user) return done(null, false)
            const auth = await bcrypt.compare(password, user.password)
            if (!auth) {
                return done(null, false)
            }

            return done(null, user)
        } catch (e) {
            console.log(e)
            return done(e)
        }
    }
)

module.exports = { localStrategy }
