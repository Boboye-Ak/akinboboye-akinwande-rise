"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@localhost/${process.env.DB_NAME}`);
exports.default = db;
