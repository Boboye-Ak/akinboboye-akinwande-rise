import { Request, Response } from "express"
import bcrypt from "bcrypt"
import validator from "validator"
import User from "../models/Users"

export const signup_post = async (req: Request, res: Response) => {
    try {
        const { full_name, email, password } = req.body
        if (!full_name || !email || !password) {
            return res.status(400).json({ message: "Please enter full name, email, and password" })
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
        const newUser: any = await User.create({
            email: email,
            full_name: full_name,
            password: hashedPassword,
        })
        req.logIn(newUser, async (err) => {
            if (err) throw err
            return res.status(200).json({
                message: "New User created successfully",
                user_id: newUser.id,
                full_name: newUser.full_name,
                email: newUser.email,
                folders: newUser.folders,
                isAdmin: newUser.isAdmin,
            })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}

export const getMyUser_get = async (req: Request, res: Response) => {
    try {
        const user: any = req.currentUser
        return res.status(200).json({
            user_id: user.id,
            full_name: user.full_name,
            email: user.email,
            folders: user.folders,
            isAdmin: user.isAdmin,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error" })
    }
}

export const logout_post = async (req: Request, res: Response) => {
    try {
        const user = req.currentUser
        if (user) {
            req.session.destroy((err) => {
                if (err) throw err
                return res.status(200).json({ message: "Logged out successfully" })
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error" })
    }
}
