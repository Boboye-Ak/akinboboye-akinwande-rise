"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaCompressor = exports.videoAndAudioOnly = exports.getsFile = exports.getFileExtension = void 0;
const Files_1 = __importDefault(require("../models/Files"));
const cloudinary_1 = require("../configs/cloudinary");
const sequelize_1 = require("sequelize");
const getFileExtension = (fileName) => {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) {
        return "";
    }
    return fileName.slice(lastDotIndex + 1);
};
exports.getFileExtension = getFileExtension;
const getsFile = async (req, res, next) => {
    try {
        const { id: fileId } = req.params;
        const currentUser = req.currentUser;
        const file = await Files_1.default.findOne({ where: { id: { [sequelize_1.Op.eq]: fileId } } });
        if (!file) {
            return res.status(404).json({ message: "File not found.", status: 404, error: true });
        }
        if (file.uploader_id != currentUser.id && !currentUser.isAdmin) {
            return res.status(401).json({
                message: "Unauthorized! Sign in as admin or file owner",
                status: 401,
                error: true,
            });
        }
        req.gottenFile = file;
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server Error", status: 500, error: true });
    }
};
exports.getsFile = getsFile;
const videoAndAudioOnly = (req, res, next) => {
    try {
        const file = req.gottenFile;
        const allowedResourceTypes = ["video", "audio"];
        if (!allowedResourceTypes.includes((0, cloudinary_1.getResourceType)(file.cloudinary_url))) {
            return res.status(400).json({
                message: "Streaming only allowed for video and audio files",
                status: 400,
                error: true,
            });
        }
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server Error", status: 500, error: true });
    }
};
exports.videoAndAudioOnly = videoAndAudioOnly;
const mediaCompressor = (req, res, next) => {
    try {
        const file = req.gottenFile;
        const quality = parseInt(req.query.quality, 10) || 100;
        const allowedExtensionTypes = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "mp4",
            "avi",
            "mkv",
            "mov",
            "mp3",
            "wav",
            "ogg",
        ];
        const fileExtension = (0, exports.getFileExtension)(file.cloudinary_url);
        if (!allowedExtensionTypes.includes(fileExtension)) {
            next();
        }
        const newCloudinaryURL = (0, cloudinary_1.compressURL)(req.gottenFile.cloudinary_url, quality);
        req.gottenFile.cloudinary_url = newCloudinaryURL;
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server Error", status: 500, error: true });
    }
};
exports.mediaCompressor = mediaCompressor;
