"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../connectDB/db"));
const Session = db_1.default.define("session", {
    sid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    expires: sequelize_1.DataTypes.DATE,
    data: sequelize_1.DataTypes.TEXT,
}, {
    timestamps: true,
});
exports.default = Session;
