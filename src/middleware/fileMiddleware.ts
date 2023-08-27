import { Request, Response, NextFunction } from "express"
import File from "../models/Files"
import { compressURL, getResourceType } from "../configs/cloudinary"

export const getFileExtension = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf(".")
    if (lastDotIndex === -1) {
        return "" // No extension found
    }
    return fileName.slice(lastDotIndex + 1)
}

export const getsFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: fileId } = req.params
        const currentUser = req.currentUser
        const file: any = await File.findOne({ where: { id: fileId } })
        if (!file) {
            return res.status(404).json({ message: "File not found." })
        }
        if (file.uploader_id != currentUser.id && !currentUser.isAdmin) {
            return res.status(401).json({ message: "Unauthorized! Sign in as admin or file owner" })
        }
        req.gottenFile = file
        next()
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Server Error" })
    }
}

export const videoAndAudioOnly = (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.gottenFile
        const allowedResourceTypes = ["video", "audio"]
        if (!allowedResourceTypes.includes(getResourceType(file.cloudinary_url))) {
            return res
                .status(400)
                .json({ message: "Streaming only allowed for video and audio files" })
        }
        next()
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Server Error" })
    }
}

export const mediaCompressor = (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.gottenFile
        const quality = parseInt(req.query.quality as string, 10) || 100
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
        ]
        const fileExtension = getFileExtension(file.cloudinary_url)
        if (!allowedExtensionTypes.includes(fileExtension)) {
            next()
        }
        const newCloudinaryURL = compressURL(req.gottenFile.cloudinary_url, quality)
        req.gottenFile.cloudinary_url = newCloudinaryURL
        next()
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Server Error" })
    }
}
