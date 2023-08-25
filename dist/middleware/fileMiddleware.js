"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoAndAudioOnly = exports.getsFile = void 0;
const Files_1 = __importDefault(require("../models/Files"));
const cloudinary_1 = require("../configs/cloudinary");
const getsFile = async (req, res, next) => {
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
        req.gottenFile = file;
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.getsFile = getsFile;
const videoAndAudioOnly = (req, res, next) => {
    try {
        const file = req.gottenFile;
        const allowedResourceTypes = ["video", "audio"];
        if (!allowedResourceTypes.includes((0, cloudinary_1.getResourceType)(file.cloudinary_url))) {
            return res
                .status(400)
                .json({ message: "Streaming only allowed for video and audio files" });
        }
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.videoAndAudioOnly = videoAndAudioOnly;
