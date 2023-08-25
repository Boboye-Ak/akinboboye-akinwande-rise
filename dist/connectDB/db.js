"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DB_URL = process.env.DB_URL;
const NODE_ENV = process.env.NODE_ENV;
const db = new sequelize_1.Sequelize(DB_URL, { logging: NODE_ENV == "test" && false });
db.sync({ force: false })
    .then(() => {
    console.log("Database synced.");
})
    .catch((error) => {
    console.error("Error syncing database:", error);
});
exports.default = db;
