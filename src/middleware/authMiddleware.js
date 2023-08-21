const User = require("../models/Users")

const userRequiresAuth = async (req, res, next) => {
    console.log(
        req.isAuthenticated() ? `user ${req.user} is authenticated` : "User is not authenticated"
    )
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication is needed" })
    } else {
        const userId = req.user
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found. It might have been deleted" })
        }
        req.currentUser = user
        next()
    }
}

const userRequiresAdmin = async (req, res, next) => {
    const { isAdmin } = req.currentUser
    if (!isAdmin) {
        return res.status(401).json({ message: "Admin privileges are required" })
    }
    next()

}

module.exports = { userRequiresAuth, userRequiresAdmin }