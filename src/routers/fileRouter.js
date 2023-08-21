const express = require("express")
const { getFileList_get, getFileData_get, getFolderList_get, addFolder_post, uploadFile_post, downloadFile_get } = require("../controllers/fileController")
const { userRequiresAuth } = require("../middleware/authMiddleware")
const { upload } = require("../configs/multer")
const router = express.Router()


router.get("/", [userRequiresAuth], getFileList_get)
router.get("/file/:id", [userRequiresAuth], getFileData_get)
router.get("/folders", [userRequiresAuth], getFolderList_get)
router.post("/folders", [userRequiresAuth], addFolder_post)
router.post("/upload", [userRequiresAuth, upload.single("file")], uploadFile_post)
router.get("/download/:id", [userRequiresAuth], downloadFile_get)



module.exports = router