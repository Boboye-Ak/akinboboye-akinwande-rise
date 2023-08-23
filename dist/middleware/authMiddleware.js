"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRequiresAdmin = exports.userRequiresAuth = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const userRequiresAuth = async (req, res, next) => {
    try {
        console.log(req.isAuthenticated()
            ? `user ${req.user} is authenticated`
            : "User is not authenticated");
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Authentication is needed" });
        }
        else {
            const userId = req.user;
            console.log(userId);
            const user = await Users_1.default.findByPk(userId);
            if (!user) {
                return res
                    .status(404)
                    .json({ message: "User not found. It might have been deleted" });
            }
            req.currentUser = user;
            next();
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.userRequiresAuth = userRequiresAuth;
const userRequiresAdmin = async (req, res, next) => {
    const { isAdmin } = req.currentUser;
    if (!isAdmin) {
        return res.status(401).json({ message: "Admin privileges are required" });
    }
    next();
};
exports.userRequiresAdmin = userRequiresAdmin;
