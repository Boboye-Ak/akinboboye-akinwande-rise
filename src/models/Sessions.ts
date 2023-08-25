import { Sequelize, DataTypes } from "sequelize"
import db from "../connectDB/db"

const Session = db.define(
    "session",
    {
        sid: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        expires: DataTypes.DATE,
        data: DataTypes.TEXT,
    },
    {
        timestamps: true,
    },
)



export default Session
