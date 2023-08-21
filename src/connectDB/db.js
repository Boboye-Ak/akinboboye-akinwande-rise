const { Sequelize } = require("sequelize")

const db = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@localhost/rise-assessment`)

module.exports = db