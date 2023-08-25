import * as bcrypt from "bcrypt"
import { Strategy as LocalStrategy } from "passport-local"
import User from "../models/Users"

const localStrategy = new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username: string, password: string, done) => {
        try {
            const user: any = await User.findOne({ where: { email: username } })
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
    },
)

export { localStrategy }
