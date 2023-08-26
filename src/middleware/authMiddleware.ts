import { Request, Response, NextFunction } from "express"
import User from "../models/Users"
import bcrypt from "bcrypt"
import validator from "validator"
import { isPasswordValid } from "../utils/password-validator"

export const userRequiresAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Authentication is needed" })
        } else {
            const userId = req.user
            const user = await User.findByPk(userId as number)
            if (!user) {
                return res
                    .status(404)
                    .json({ message: "User not found. It might have been deleted" })
            }
            req.currentUser = user
            next()
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Server Error" })
    }
}

export const userRequiresAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { isAdmin } = req.currentUser
    if (!isAdmin) {
        return res.status(401).json({ message: "Admin privileges are required" })
    }
    next()
}

export const signupValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { full_name, email, password } = req.body
        if (!full_name || !email || !password) {
            return res.status(400).json({ message: "Please enter full name, email, and password" })
        }
        if (!isPasswordValid(password)) {
            return res.status(400).json({
                message:
                    "Password too weak. Password must contain uppercase, lowercase, numbers, symbol and at least 8 characters",
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" })
        }
        const existingUserWithEmail = await User.findOne({ where: { email: email } })
        if (existingUserWithEmail) {
            return res.status(409).json({ message: "User with this email already exists" })
        }
        const salt: string = await bcrypt.genSalt()
        const hashedPassword: string = await bcrypt.hash(password, salt)
        req.hashedPassword = hashedPassword
        next()
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Server Error" })
    }
}
