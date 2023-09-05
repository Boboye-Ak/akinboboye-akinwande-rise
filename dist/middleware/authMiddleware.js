"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidator = exports.userRequiresAdmin = exports.userRequiresAuth = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const password_validator_1 = require("../utils/password-validator");
const userRequiresAuth = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            return res
                .status(401)
                .json({ message: "Authentication is needed", status: 401, error: true });
        }
        else {
            const userId = req.user;
            const user = await Users_1.default.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found. It might have been deleted",
                    status: 404,
                    error: true,
                });
            }
            req.currentUser = user;
            next();
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server Error", status: 500, error: true });
    }
};
exports.userRequiresAuth = userRequiresAuth;
const userRequiresAdmin = async (req, res, next) => {
    const { isAdmin } = req.currentUser;
    if (!isAdmin) {
        return res
            .status(401)
            .json({ message: "Admin privileges are required", status: 401, error: true });
    }
    next();
};
exports.userRequiresAdmin = userRequiresAdmin;
const signupValidator = async (req, res, next) => {
    try {
        const { full_name, email, password } = req.body;
        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "Please enter full name, email, and password",
                status: 400,
                error: true,
            });
        }
        if (!(0, password_validator_1.isPasswordValid)(password)) {
            return res.status(400).json({
                message: "Password too weak. Password must contain uppercase, lowercase, numbers, symbol and at least 8 characters",
                status: 400,
                error: true,
            });
        }
        if (!validator_1.default.isEmail(email)) {
            return res
                .status(400)
                .json({ message: "Please enter a valid email address", status: 400, error: true });
        }
        const existingUserWithEmail = await Users_1.default.findOne({ where: { email: email } });
        if (existingUserWithEmail) {
            return res
                .status(409)
                .json({ message: "User with this email already exists", status: 409, error: true });
        }
        const salt = await bcrypt_1.default.genSalt();
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        req.hashedPassword = hashedPassword;
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server Error", status: 500, error: true });
    }
};
exports.signupValidator = signupValidator;
