const Sequelize = require("sequelize")
const db = require("../connectDB/db")

const Session = db.define('session', {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    expires: Sequelize.DATE,
    data: Sequelize.TEXT,
});

module.exports = Session