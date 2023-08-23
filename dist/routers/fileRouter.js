"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileController_1 = require("../controllers/fileController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = require("../configs/multer");
const router = express_1.default.Router();
router.get("/", [authMiddleware_1.userRequiresAuth], fileController_1.getFileList_get);
router.get("/file/:id", [authMiddleware_1.userRequiresAuth], fileController_1.getFileData_get);
router.get("/folders", [authMiddleware_1.userRequiresAuth], fileController_1.getFolderList_get);
router.post("/folders", [authMiddleware_1.userRequiresAuth], fileController_1.addFolder_post);
router.post("/upload", [authMiddleware_1.userRequiresAuth, multer_1.upload.single("file")], fileController_1.uploadFile_post);
router.get("/download/:id", [authMiddleware_1.userRequiresAuth], fileController_1.downloadFile_get);
router.delete("/delete/:id", [authMiddleware_1.userRequiresAuth], fileController_1.deleteFile_delete);
router.put("/flag/:id", [authMiddleware_1.userRequiresAuth, authMiddleware_1.userRequiresAdmin], fileController_1.flagFile_admin_put);
exports.default = router;
