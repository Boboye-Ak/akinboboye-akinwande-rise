"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../connectDB/db"));
const User = db_1.default.define("user", {
    email: {
        type: sequelize_1.DataTypes.STRING,
        validate: {
            isEmail: true,
        },
        unique: true,
    },
    full_name: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
    folders: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: [],
    },
    isAdmin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
});
exports.default = User;
