import { Request, Response, NextFunction } from "express"
import User from "../models/Users"

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
