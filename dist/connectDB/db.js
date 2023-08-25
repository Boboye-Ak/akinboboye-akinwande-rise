"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DB_URL = process.env.DB_URL;
const db = new sequelize_1.Sequelize(DB_URL, { logging: false });
exports.default = db;
