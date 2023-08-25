import { Request, Response, NextFunction } from "express"
import File from "../models/Files"
import { getResourceType } from "../configs/cloudinary"
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
