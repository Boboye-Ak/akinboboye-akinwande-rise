"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../connectDB/db"));
const File = db_1.default.define("file", {
    uploader_id: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    file_name: {
        type: sequelize_1.DataTypes.STRING,
    },
    file_size: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    folder_name: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    cloudinary_url: {
        type: sequelize_1.DataTypes.STRING,
    },
    public_id: {
        type: sequelize_1.DataTypes.STRING,
    },
    isUploaded: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    isFlagged: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    flaggers: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.NUMBER),
        defaultValue: [],
    },
});
exports.default = File;
