import { Sequelize, DataTypes } from "sequelize"
import db from "../connectDB/db"

const User = db.define("user", {
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
        }, unique:true
    },
    full_name: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    folders: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
})

export default User
