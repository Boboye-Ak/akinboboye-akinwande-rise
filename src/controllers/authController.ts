import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import validator from "validator"
import passport from "passport"
import User from "../models/Users"
import { isPasswordValid } from "../utils/password-validator"

export const signup_post = async (req: Request, res: Response) => {
    try {
        const hashedPassword = req.hashedPassword
        const { email, full_name } = req.body
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

export const login_post = (req: Request, res: Response, next: NextFunction) => {
    // #swagger.description = 'Endpoint for users to login'
    passport.authenticate("local", (err: Error, user: any, info: any) => {
        if (err) throw err
        if (!user)
            res.status(404).json({
                message: "Could not login. Check email address and password",
                status: 404,
            })
        else {
            req.logIn(user, (err) => {
                if (err) throw err
                res.status(200).json({ message: "Successfully Authenticated", status: 200 })
            })
        }
    })(req, res, next)
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
