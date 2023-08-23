import express from "express"
import { signup_post, getMyUser_get, logout_post } from "../controllers/authController"
import passport from "passport"
import { userRequiresAuth } from "../middleware/authMiddleware"

const router = express.Router()

router.post("/signup", signup_post)
router.post("/login", (req, res, next) => {
    // #swagger.description = 'Endpoint for users to login'
    passport.authenticate("local", (err: Error, user: any, info: any) => {
        console.log(user)
        if (err) throw err
        if (!user)
            res.status(404).json({
                message: "Could not login. Check email address and password",
                status: 404,
            })
        else {
            req.logIn(user, (err) => {
                if (err) throw err
                console.log(req.user)
                res.status(200).json({ message: "Successfully Authenticated", status: 200 })
            })
        }
    })(req, res, next)
})
router.get("/myuser", [userRequiresAuth], getMyUser_get)

router.post("/logout", [userRequiresAuth], logout_post)

export default router
