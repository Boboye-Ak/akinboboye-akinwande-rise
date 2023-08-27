import express from "express"
import {
    getFileList_get,
    getFileData_get,
    getFolderList_get,
    addFolder_post,
    uploadFile_post,
    downloadFile_get,
    deleteFile_delete,
    flagFile_admin_put,
    streamFile_get,
    downloadCompressedFile_get,
} from "../controllers/fileController"
import { userRequiresAuth, userRequiresAdmin } from "../middleware/authMiddleware"
import { upload } from "../configs/multer"
import { getsFile, mediaCompressor, videoAndAudioOnly } from "../middleware/fileMiddleware"

const router = express.Router()

router.get("/", [userRequiresAuth], getFileList_get)
router.get("/file/:id", [userRequiresAuth, getsFile], getFileData_get)
router.get("/folders", [userRequiresAuth], getFolderList_get)
router.post("/folders", [userRequiresAuth], addFolder_post)
router.post("/upload", [userRequiresAuth, upload.single("file")], uploadFile_post)
router.get("/download/:id", [userRequiresAuth, getsFile, mediaCompressor], downloadFile_get)
router.get("/downloadcompressed/:id", [userRequiresAuth, getsFile, mediaCompressor], downloadCompressedFile_get)
router.get(
    "/stream/:id",
    [userRequiresAuth, getsFile, videoAndAudioOnly, mediaCompressor],
    streamFile_get,
)
router.delete("/delete/:id", [userRequiresAuth], deleteFile_delete)
router.put("/flag/:id", [userRequiresAuth, userRequiresAdmin], flagFile_admin_put)

export default router
