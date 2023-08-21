const { uploadFile } = require("../configs/cloudinary")
const File = require("../models/Files")
const User = require("../models/Users")
const axios = require("axios")

module.exports.getFileList_get = async (req, res) => {
    // #swagger.description = 'Endpoint to get list of file data'
    try {
        const currentUser = req.currentUser
        const page = parseInt(req.query.page) || 1 // Default to page 1
        const limit = parseInt(req.query.limit) || 20 // Default to limit of 20 items per page
        const folder = req.query.folder
        const queryObject = {}
        folder && currentUser.folders.includes(folder) ? queryObject.folder = folder : null
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

module.exports.getFileData_get = async (req, res) => {
    // #swagger.description = 'Endpoint to get data for a single file'
    try {
        const { id: fileId } = req.params
        const currentUser = req.currentUser
        const file = await File.findOne({ where: { id: fileId } })
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

module.exports.getFolderList_get = async (req, res) => {
    try {
        const currentUser = req.currentUser
        return res.status(200).json(currentUser.folders)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}

module.exports.addFolder_post = async (req, res) => {
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

module.exports.uploadFile_post = async (req, res) => {
    // #swagger.description = 'Endpoint to upload a file'
    try {
        const currentUser = req.currentUser
        const { folderName } = req.body
        if (!req.file) {
            return res.status(400).json({ message: "Please upload file as form data" })
        }
        const { size, originalname } = req.file
        const fileUrl = await uploadFile(req.file)
        const newFileObject = { uploader_id: currentUser.id, file_name: originalname, file_size: size, cloudinary_url: fileUrl, isUploaded: true }
        folderName ? newFileObject.folder_name = folderName : null
        const newFile = await File.create(newFileObject)
        console.log(newFile)
        if (!currentUser.folders.includes(folderName)) {
            currentUser.folders.push(folderName)
            await User.update({ folders: currentUser.folders }, { where: { id: currentUser.id } })
        }
        return res.status(200).json(newFile)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }

}

module.exports.downloadFile_get = async (req, res) => {
    // #swagger.description = 'Endpoint to download a single file'
    try {
        const currentUser = req.currentUser
        const { id: fileId } = req.params
        const file = await File.findByPk(fileId)
        if (!file) {
            return res.status(404).json({ message: "File not found" })
        }
          if (file.uploader_id != currentUser.id && !currentUser.isAdmin) {
              return res.status(401).json({ message: "Unauthorized! Only file owner and admin can download" })
          }
        const response = await axios.get(file.cloudinary_url, { responseType: 'arraybuffer' });
        const contentType = 'application/octet-stream';
        res.setHeader('Content-Disposition', `attachment; filename="${file.file_name}"`);
        res.setHeader('Content-Type', contentType);
        res.send(response.data);


    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }


}



module.exports.deleteFile_delete = async (req, res) => {

    try {
        const currentUser = req.currentUser

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }
}


module.exports.flagFile_admin_post = async (req, res) => {

    try {

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }

}