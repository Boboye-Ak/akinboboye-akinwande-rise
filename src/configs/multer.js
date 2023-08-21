const multer = require("multer")
const path = require("path")



const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})



const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 200,
    },
})

module.exports = { upload }
