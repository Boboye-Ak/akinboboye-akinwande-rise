"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStrategy = void 0;
const bcrypt = __importStar(require("bcrypt"));
const passport_local_1 = require("passport-local");
const Users_1 = __importDefault(require("../models/Users"));
const localStrategy = new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, async (username, password, done) => {
    try {
        const user = await Users_1.default.findOne({ where: { email: username } });
        if (!user)
            return done(null, false);
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (e) {
        console.log(e);
        return done(e);
    }
});
exports.localStrategy = localStrategy;
