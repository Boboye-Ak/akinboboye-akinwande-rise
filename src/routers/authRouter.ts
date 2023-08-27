import express from "express"
import { signup_post, getMyUser_get, logout_post, login_post } from "../controllers/authController"
import { signupValidator, userRequiresAuth } from "../middleware/authMiddleware"

const router = express.Router()

router.post("/signup", [signupValidator], signup_post)
router.post("/login", login_post)
router.get("/myuser", [userRequiresAuth], getMyUser_get)
router.post("/logout", [userRequiresAuth], logout_post)

export default router
