"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressURL = exports.clearCloudinaryFolder = exports.deleteCloudinaryFile = exports.getResourceType = exports.uploadFile = void 0;
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
const compressURL = (url, percentageQuality) => {
    const urlArray = url.split("upload/");
    urlArray.splice(1, 0, `upload/q_${percentageQuality}/`);
    return urlArray.join("");
};
exports.compressURL = compressURL;
