"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout_post = exports.getMyUser_get = exports.signup_post = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const Users_1 = __importDefault(require("../models/Users"));
const signup_post = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;
        if (!full_name || !email || !password) {
            return res.status(400).json({ message: "Please enter full name, email, and password" });
        }
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }
        const existingUserWithEmail = await Users_1.default.findOne({ where: { email: email } });
        if (existingUserWithEmail) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        const salt = await bcrypt_1.default.genSalt();
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
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
