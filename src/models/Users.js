const Sequelize = require("sequelize")
const db = require("../connectDB/db")

const User = db.define("user", {
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true,
        },
    },
    full_name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    folders: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
    }
})

module.exports=User