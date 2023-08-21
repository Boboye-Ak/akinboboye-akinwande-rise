const {Sequelize}=require("sequelize")

const db = new Sequelize(`postgres://postgres:${process.env.DBPASS}@localhost/Books`)

module.exports=db