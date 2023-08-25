import { Request, Response } from "express"
const { uploadFile, deleteCloudinaryFile } = require("../configs/cloudinary")
import File from "../models/Files"
import User from "../models/Users"
import axios from "axios"

export const getFileList_get = async (req: Request, res: Response) => {
    // #swagger.description = 'Endpoint to get list of file data'
    try {
        const currentUser = req.currentUser
        const page: number = parseInt(req.query.page as string, 10) || 1 // Default to page 1
        const limit: number = parseInt(req.query.limit as string, 10) || 20 // Default to limit of 20 items per page
        const folder = req.query.folder
        const showDeletedFiles: number = parseInt(req.query.showDeletedFiles as string, 10) || 0
        const queryObject: any = {}
        folder && currentUser.folders.includes(folder) ? (queryObject.folder = folder) : null
        !showDeletedFiles ? (queryObject.isUploaded = true) : null
        queryObject.uploader_id = currentUser.id
        const files = await File.findAll({
            where: queryObject,
            offset: (page - 1) * limit,
            limit: limit,
        })
        return res.status(200).json(files)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}

export const getFileData_get = async (req: Request, res: Response) => {
    // #swagger.description = 'Endpoint to get data for a single file'
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
        return res.status(200).json(file)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}

export const getFolderList_get = async (req: Request, res: Response) => {
    try {
        const currentUser = req.currentUser
        return res.status(200).json(currentUser.folders)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}

export const addFolder_post = async (req: Request, res: Response) => {
    try {
        const { folderName } = req.body
        if (!folderName) {
            return res.status(400).json({ message: "Please enter folder name" })
        }
        const currentUser = req.currentUser
        if (currentUser.folders.includes(folderName)) {
            return res.status(409).json({ message: `Folder named "${folderName}" already exists` })
        }
        currentUser.folders.push(folderName)
        await User.update({ folders: currentUser.folders }, { where: { id: currentUser.id } })
        return res.status(200).json({ message: `Folder "${folderName}" added successfully` })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}

export const uploadFile_post = async (req: Request, res: Response) => {
    // #swagger.description = 'Endpoint to upload a file'
    try {
        const currentUser = req.currentUser
        const { folderName } = req.body
        if (!req.file) {
            return res.status(400).json({ message: "Please upload file as form data" })
        }
        const { size, originalname } = req.file
        const { fileUrl, publicId } = await uploadFile(req.file)
        const newFileObject = {
            uploader_id: currentUser.id,
            file_name: originalname,
            file_size: size,
            cloudinary_url: fileUrl,
            public_id: publicId,
            isUploaded: true,
            folder_name: null,
        }
        folderName ? (newFileObject.folder_name = folderName) : null
        const newFile = await File.create(newFileObject)
        if (!currentUser.folders.includes(folderName)) {
            currentUser.folders.push(folderName)
            await User.update({ folders: currentUser.folders }, { where: { id: currentUser.id } })
        }
        return res
            .status(200)
            .json({ message: "New file uploaded successfully", ...newFile.toJSON() })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}

export const downloadFile_get = async (req: Request, res: Response) => {
    // #swagger.description = 'Endpoint to download a single file'
    try {
        const currentUser = req.currentUser
        const { id: fileId } = req.params
        const file: any = await File.findByPk(fileId)
        if (!file) {
            return res.status(404).json({ message: "File not found" })
        }
        if (file.uploader_id != currentUser.id && !currentUser.isAdmin) {
            return res
                .status(401)
                .json({ message: "Unauthorized! Only file owner and admin can download" })
        }
        const response = await axios.get(file.cloudinary_url, { responseType: "arraybuffer" })
        const contentType = "application/octet-stream"
        res.setHeader("Content-Disposition", `attachment; filename="${file.file_name}"`)
        res.setHeader("Content-Type", contentType)
        res.send(response.data)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}

export const deleteFile_delete = async (req: Request, res: Response) => {
    try {
        const { id: fileId } = req.params
        const currentUser = req.currentUser
        const fileToBeDeleted: any = await File.findOne({ where: { isUploaded: true, id: fileId } })
        if (!fileToBeDeleted) {
            return res.status(404).json({ message: "File not found" })
        }
        if (fileToBeDeleted.uploader_id != currentUser.id && !currentUser.isAdmin) {
            return res.status(401).json({ message: "Only file owner and admin can delete a file" })
        }
        await deleteCloudinaryFile(fileToBeDeleted.public_id, fileToBeDeleted.cloudinary_url)
        fileToBeDeleted.isUploaded = false
        await fileToBeDeleted.save()
        return res
            .status(200)
            .json({ message: "File Deleted Successfully", deletedFile: fileToBeDeleted })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}

export const flagFile_admin_put = async (req: Request, res: Response) => {
    try {
        const { id: fileId } = req.params
        const currentUser: any = req.currentUser
        let fileToBeFlagged: any = await File.findOne({
            where: { isUploaded: true, id: fileId, isFlagged: false },
        })
        if (!fileToBeFlagged) {
            return res.status(404).json({ message: "File not found" })
        }
        const flaggers = fileToBeFlagged.flaggers
        if (!flaggers.includes(currentUser.id)) {
            flaggers.push(currentUser.id)
            await File.update({ flaggers: flaggers }, { where: { id: fileToBeFlagged.id } })
        }
        if (fileToBeFlagged.flaggers.length >= 2) {
            await deleteCloudinaryFile(fileToBeFlagged.public_id, fileToBeFlagged.cloudinary_url)
            await File.update(
                { isFlagged: true, isUploaded: false },
                { where: { id: fileToBeFlagged.id } },
            )
        }
        fileToBeFlagged = await File.findOne({
            where: { id: fileId },
        })
        return res
            .status(200)
            .json({ message: "File Flagged Successfully", flaggedFile: fileToBeFlagged })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}
