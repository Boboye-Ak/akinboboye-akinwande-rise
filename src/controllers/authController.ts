import { Request, Response, NextFunction } from "express"
import passport from "passport"
import User from "../models/Users"

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
                status: 200,
                error: false,
                user_id: newUser.id,
                full_name: newUser.full_name,
                email: newUser.email,
                folders: newUser.folders,
                isAdmin: newUser.isAdmin,
            })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error", status: 500, error: true })
    }
}

export const login_post = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: any, info: any) => {
        if (err) throw err
        if (!user)
            res.status(404).json({
                message: "Could not login. Check email address and password",
                status: 404,
                error: true,
            })
        else {
            req.logIn(user, (err) => {
                if (err) throw err
                res.status(200).json({
                    message: "Successfully Authenticated",
                    status: 200,
                    error: false,
                })
            })
        }
    })(req, res, next)
}

export const getMyUser_get = async (req: Request, res: Response) => {
    try {
        const user = req.currentUser
        return res.status(200).json({
            status: 200,
            error: false,
            user_id: user.id,
            full_name: user.full_name,
            email: user.email,
            folders: user.folders,
            isAdmin: user.isAdmin,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error", status: 500, error: true })
    }
}

export const logout_post = async (req: Request, res: Response) => {
    try {
        const user = req.currentUser
        if (user) {
            req.session.destroy((err) => {
                if (err) throw err
                return res
                    .status(200)
                    .json({ message: "Logged out successfully", status: 200, error: false })
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error", status: 500, error: true })
    }
}
