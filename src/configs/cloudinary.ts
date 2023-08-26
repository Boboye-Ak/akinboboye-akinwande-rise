import { v2 as cloudinary } from "cloudinary"
import { Request } from "express"
import File from "../models/Files"
const CLOUDINARY_FOLDER_NAME = process.env.CLOUDINARY_FOLDER_NAME

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const getPublicId = (url: string): string => {
    return url.split("/").pop()!
    //return url.split("/").pop()!.split(".")[0]
}

export const uploadFile = async (file: Express.Multer.File) => {
    try {
        const path = file.path
        const uploadedFile = await cloudinary.uploader.upload(path, {
            folder: CLOUDINARY_FOLDER_NAME,
            resource_type: "auto",
        })
        const fileUrl = uploadedFile.secure_url
        const publicId = uploadedFile.public_id
        return { fileUrl, publicId }
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const getResourceType = (cloudinaryUrl: string): string => {
    const splitUrl = cloudinaryUrl.split("/")
    const resourceType = splitUrl[splitUrl.indexOf("upload") - 1]
    return resourceType
}

export const deleteCloudinaryFile = async (publicId: string, cloudinaryUrl: string) => {
    try {
        const resourceType = getResourceType(cloudinaryUrl)
        const fileExtension = cloudinaryUrl.split(".").pop()!
        const stringForDeleting = publicId.concat(".").concat(fileExtension)
        await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        })
        //await cloudinary.uploader.destroy(stringForDeleting)
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const clearCloudinaryFolder = async (folderName: string) => {
    try {
        console.log(`trying to clear cloudinary folder ${folderName}`)
        await cloudinary.api.delete_resources_by_prefix(folderName)
        console.log("cloudinary folder cleared")
    } catch (e) {
        console.log(e)
        console.log("Error clearing cloudinary folder")
    }
}

export const compressURL = (url: string, percentageQuality: number) => {
    const urlArray = url.split("upload/")
    urlArray.splice(1, 0, `upload/q_${percentageQuality}/`)
    return urlArray.join("")
}
