"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCloudinaryFolder = exports.deleteCloudinaryFile = exports.getResourceType = exports.uploadFile = void 0;
const cloudinary_1 = require("cloudinary");
const CLOUDINARY_FOLDER_NAME = process.env.CLOUDINARY_FOLDER_NAME;
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const getPublicId = (url) => {
    return url.split("/").pop();
    //return url.split("/").pop()!.split(".")[0]
};
const uploadFile = async (file) => {
    try {
        let path = file.path;
        const uploadedFile = await cloudinary_1.v2.uploader.upload(path, {
            folder: CLOUDINARY_FOLDER_NAME,
            resource_type: "auto",
        });
        const fileUrl = uploadedFile.secure_url;
        const publicId = uploadedFile.public_id;
        return { fileUrl, publicId };
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
exports.uploadFile = uploadFile;
const getResourceType = (cloudinaryUrl) => {
    const splitUrl = cloudinaryUrl.split("/");
    const resourceType = splitUrl[splitUrl.indexOf("upload") - 1];
    return resourceType;
};
exports.getResourceType = getResourceType;
const deleteCloudinaryFile = async (publicId, cloudinaryUrl) => {
    try {
        const resourceType = (0, exports.getResourceType)(cloudinaryUrl);
        const fileExtension = cloudinaryUrl.split(".").pop();
        const stringForDeleting = publicId.concat(".").concat(fileExtension);
        await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        });
        //await cloudinary.uploader.destroy(stringForDeleting)
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
exports.deleteCloudinaryFile = deleteCloudinaryFile;
const clearCloudinaryFolder = async (folderName) => {
    try {
        console.log(`trying to clear cloudinary folder ${folderName}`);
        await cloudinary_1.v2.api.delete_resources_by_prefix(folderName);
        console.log("cloudinary folder cleared");
    }
    catch (e) {
        console.log(e);
        console.log("Error clearing cloudinary folder");
    }
};
exports.clearCloudinaryFolder = clearCloudinaryFolder;
const templateForUploadedFileForMP3 = {
    asset_id: "08ab760803bba450e664c90a70c96f16",
    public_id: "rise-assessment/omkoo2kxmsh3rb0hogd0",
    version: 1692808034,
    version_id: "9899cc4096514f6f2d96c0e77d36efef",
    signature: "41f345c2da87cd85af1fb2f91fa732625c756746",
    width: 0,
    height: 0,
    format: "mp3",
    resource_type: "video",
    created_at: "2023-08-23T16:27:14Z",
    tags: [],
    pages: 0,
    bytes: 733645,
    type: "upload",
    etag: "cdd5a8079dda1acdda848defdd1c256a",
    placeholder: false,
    url: "http://res.cloudinary.com/dc55ir792/video/upload/v1692808034/rise-assessment/omkoo2kxmsh3rb0hogd0.mp3",
    secure_url: "https://res.cloudinary.com/dc55ir792/video/upload/v1692808034/rise-assessment/omkoo2kxmsh3rb0hogd0.mp3",
    playback_url: "https://res.cloudinary.com/dc55ir792/video/upload/sp_auto/v1692808034/rise-assessment/omkoo2kxmsh3rb0hogd0.m3u8",
    folder: "rise-assessment",
    audio: {
        codec: "mp3",
        bit_rate: "139529",
        frequency: 44100,
        channels: 2,
        channel_layout: "stereo",
    },
    video: {},
    is_audio: true,
    bit_rate: 139552,
    duration: 42.057143,
    original_filename: "1692808029001-file_example_MP3_700KB",
    api_key: "281961919942586",
};
const templateForRawFile = {
    asset_id: "95f1799ec7e86daf30066b774dee6d19",
    public_id: "rise-assessment/ih3kattqxibccd0d2wfh",
    version: 1692808631,
    version_id: "5e02d4779b71b3e5697acdf743229460",
    signature: "8bcea5825e04ca9b49bf685a45eb391cef9e0236",
    width: 612,
    height: 792,
    format: "pdf",
    resource_type: "image",
    created_at: "2023-08-23T16:37:11Z",
    tags: [],
    pages: 1,
    bytes: 72177,
    type: "upload",
    etag: "b40ae85cebf29ec908503e2284f3cee5",
    placeholder: false,
    url: "http://res.cloudinary.com/dc55ir792/image/upload/v1692808631/rise-assessment/ih3kattqxibccd0d2wfh.pdf",
    secure_url: "https://res.cloudinary.com/dc55ir792/image/upload/v1692808631/rise-assessment/ih3kattqxibccd0d2wfh.pdf",
    folder: "rise-assessment",
    original_filename: "1692808629607-SOPHIA ANUYAH Cover Letter (1)",
    api_key: "281961919942586",
};
