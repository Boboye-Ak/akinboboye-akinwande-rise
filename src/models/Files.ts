import { Sequelize, DataTypes } from "sequelize"
import db from "../connectDB/db"

const File = db.define(
    "file",
    {
        uploader_id: {
            type: DataTypes.INTEGER,
        },
        file_name: {
            type: DataTypes.STRING,
        },
        file_size: {
            type: DataTypes.INTEGER,
        },
        folder_name: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        cloudinary_url: {
            type: DataTypes.STRING,
        },
        public_id: {
            type: DataTypes.STRING,
        },
        isUploaded: {
            type: DataTypes.BOOLEAN,
        },
        isFlagged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        flaggers: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: [],
        },
    },
    {
        timestamps: true,
    },
)

export default File
