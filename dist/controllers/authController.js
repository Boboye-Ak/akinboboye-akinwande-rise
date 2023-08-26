"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout_post = exports.getMyUser_get = exports.login_post = exports.signup_post = void 0;
const passport_1 = __importDefault(require("passport"));
const Users_1 = __importDefault(require("../models/Users"));
const signup_post = async (req, res) => {
    try {
        const hashedPassword = req.hashedPassword;
        const { email, full_name } = req.body;
        const newUser = await Users_1.default.create({
            email: email,
            full_name: full_name,
            password: hashedPassword,
        });
        req.logIn(newUser, async (err) => {
            if (err)
                throw err;
            return res.status(200).json({
                message: "New User created successfully",
                user_id: newUser.id,
                full_name: newUser.full_name,
                email: newUser.email,
                folders: newUser.folders,
                isAdmin: newUser.isAdmin,
            });
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
exports.signup_post = signup_post;
const login_post = (req, res, next) => {
    // #swagger.description = 'Endpoint for users to login'
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err)
            throw err;
        if (!user)
            res.status(404).json({
                message: "Could not login. Check email address and password",
                status: 404,
            });
        else {
            req.logIn(user, (err) => {
                if (err)
                    throw err;
                res.status(200).json({ message: "Successfully Authenticated", status: 200 });
            });
        }
    })(req, res, next);
};
exports.login_post = login_post;
const getMyUser_get = async (req, res) => {
    try {
        const user = req.currentUser;
        return res.status(200).json({
            user_id: user.id,
            full_name: user.full_name,
            email: user.email,
            folders: user.folders,
            isAdmin: user.isAdmin,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.getMyUser_get = getMyUser_get;
const logout_post = async (req, res) => {
    try {
        const user = req.currentUser;
        if (user) {
            req.session.destroy((err) => {
                if (err)
                    throw err;
                return res.status(200).json({ message: "Logged out successfully" });
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.logout_post = logout_post;
