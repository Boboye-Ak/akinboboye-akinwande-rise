const Sequelize = require("sequelize")
const db = require("../connectDB/db")

const File = db.define("file", {
    uploader_id: {
        type: Sequelize.NUMBER
    },
    file_name: {
        type: Sequelize.STRING
    },
    file_size: {
        type: Sequelize.NUMBER
    },
    folder_name: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    cloudinary_url: {
        type: Sequelize.STRING
    },
    isUploaded: {
        type: Sequelize.BOOLEAN
    }, isFlagged: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})

module.exports = File