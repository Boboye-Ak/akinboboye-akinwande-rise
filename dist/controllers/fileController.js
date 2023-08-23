"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagFile_admin_put = exports.deleteFile_delete = exports.downloadFile_get = exports.uploadFile_post = exports.addFolder_post = exports.getFolderList_get = exports.getFileData_get = exports.getFileList_get = void 0;
const { uploadFile, deleteCloudinaryFile } = require("../configs/cloudinary");
const Files_1 = __importDefault(require("../models/Files"));
const Users_1 = __importDefault(require("../models/Users"));
const axios_1 = __importDefault(require("axios"));
const getFileList_get = async (req, res) => {
    // #swagger.description = 'Endpoint to get list of file data'
    try {
        const currentUser = req.currentUser;
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 20; // Default to limit of 20 items per page
        const folder = req.query.folder;
        const hideDeletedFiles = parseInt(req.query.hideDeletedFiles, 10);
        const queryObject = {};
        folder && currentUser.folders.includes(folder) ? (queryObject.folder = folder) : null;
        hideDeletedFiles ? (queryObject.isUploaded = true) : null;
        queryObject.uploader_id = currentUser.id;
        const files = await Files_1.default.findAll({
            where: queryObject,
            offset: (page - 1) * limit,
            limit: limit,
        });
        return res.status(200).json(files);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
exports.getFileList_get = getFileList_get;
const getFileData_get = async (req, res) => {
    // #swagger.description = 'Endpoint to get data for a single file'
    try {
        const { id: fileId } = req.params;
        const currentUser = req.currentUser;
        const file = await Files_1.default.findOne({ where: { id: fileId } });
        if (!file) {
            return res.status(404).json({ message: "File not found." });
        }
        if (file.uploader_id != currentUser.id && !currentUser.isAdmin) {
            return res.status(401).json({ message: "Unauthorized! Sign in as admin or file owner" });
        }
        return res.status(200).json(file);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
exports.getFileData_get = getFileData_get;
const getFolderList_get = async (req, res) => {
    try {
        const currentUser = req.currentUser;
        return res.status(200).json(currentUser.folders);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
exports.getFolderList_get = getFolderList_get;
const addFolder_post = async (req, res) => {
    try {
        const { folderName } = req.body;
        if (!folderName) {
            return res.status(400).json({ message: "Please enter folder name" });
        }
        const currentUser = req.currentUser;
        if (currentUser.folders.includes(folderName)) {
            return res.status(409).json({ message: `Folder named "${folderName}" already exists` });
        }
        currentUser.folders.push(folderName);
        await Users_1.default.update({ folders: currentUser.folders }, { where: { id: currentUser.id } });
        return res.status(200).json({ message: `Folder "${folderName}" added successfully` });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
exports.addFolder_post = addFolder_post;
const uploadFile_post = async (req, res) => {
    // #swagger.description = 'Endpoint to upload a file'
    try {
        const currentUser = req.currentUser;
        const { folderName } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Please upload file as form data" });
        }
        const { size, originalname } = req.file;
        const { fileUrl, publicId } = await uploadFile(req.file);
        const newFileObject = {
            uploader_id: currentUser.id,
            file_name: originalname,
            file_size: size,
            cloudinary_url: fileUrl,
            public_id: publicId,
            isUploaded: true,
            folder_name: null,
        };
        folderName ? (newFileObject.folder_name = folderName) : null;
        const newFile = await Files_1.default.create(newFileObject);
        console.log(newFile);
        if (!currentUser.folders.includes(folderName)) {
            currentUser.folders.push(folderName);
            await Users_1.default.update({ folders: currentUser.folders }, { where: { id: currentUser.id } });
        }
        return res.status(200).json(newFile);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
exports.uploadFile_post = uploadFile_post;
const downloadFile_get = async (req, res) => {
    // #swagger.description = 'Endpoint to download a single file'
    try {
        const currentUser = req.currentUser;
        const { id: fileId } = req.params;
        const file = await Files_1.default.findByPk(fileId);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        if (file.uploader_id != currentUser.id && !currentUser.isAdmin) {
            return res
                .status(401)
                .json({ message: "Unauthorized! Only file owner and admin can download" });
        }
        const response = await axios_1.default.get(file.cloudinary_url, { responseType: "arraybuffer" });
        const contentType = "application/octet-stream";
        res.setHeader("Content-Disposition", `attachment; filename="${file.file_name}"`);
        res.setHeader("Content-Type", contentType);
        res.send(response.data);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
exports.downloadFile_get = downloadFile_get;
const deleteFile_delete = async (req, res) => {
    try {
        const { id: fileId } = req.params;
        const currentUser = req.currentUser;
        const fileToBeDeleted = await Files_1.default.findOne({ where: { isUploaded: true, id: fileId } });
        if (!fileToBeDeleted) {
            return res.status(404).json({ message: "File not found" });
        }
        if (fileToBeDeleted.uploader_id != currentUser.id && !currentUser.isAdmin) {
            return res.status(401).json({ message: "Only file owner and admin can delete a file" });
        }
        await deleteCloudinaryFile(fileToBeDeleted.public_id, fileToBeDeleted.cloudinary_url);
        fileToBeDeleted.isUploaded = false;
        await fileToBeDeleted.save();
        return res
            .status(200)
            .json({ message: "File Deleted Successfully", deletedFile: fileToBeDeleted });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
exports.deleteFile_delete = deleteFile_delete;
const flagFile_admin_put = async (req, res) => {
    try {
        const { id: fileId } = req.params;
        const currentUser = req.currentUser;
        let fileToBeFlagged = await Files_1.default.findOne({
            where: { isUploaded: true, id: fileId, isFlagged: false },
        });
        if (!fileToBeFlagged) {
            return res.status(404).json({ message: "File not found" });
        }
        const flaggers = fileToBeFlagged.flaggers;
        if (!flaggers.includes(currentUser.id)) {
            flaggers.push(currentUser.id);
            await Files_1.default.update({ flaggers: flaggers }, { where: { id: fileToBeFlagged.id } });
        }
        if (fileToBeFlagged.flaggers.length >= 2) {
            await deleteCloudinaryFile(fileToBeFlagged.public_id, fileToBeFlagged.cloudinary_url);
            await Files_1.default.update({ isFlagged: true, isUploaded: false }, { where: { id: fileToBeFlagged.id } });
        }
        fileToBeFlagged = await Files_1.default.findOne({
            where: { id: fileId },
        });
        return res
            .status(200)
            .json({ message: "File Flagged Successfully", flaggedFile: fileToBeFlagged });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
exports.flagFile_admin_put = flagFile_admin_put;