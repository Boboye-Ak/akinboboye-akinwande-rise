const File = require("../models/Files")

module.exports.getFileList_get = async (req, res) => {
    // #swagger.description = 'Endpoint to get list of file data'
    try {
        
    } catch (err) {
       console.log(err)
       return res.status(500).json({ message: "server error" })
   }
    return res.status(200).json([])
}

module.exports.getFileData_get = async (req, res) => {
    // #swagger.description = 'Endpoint to get data for a single file'
    try {
        
    } catch (err) {
       console.log(err)
       return res.status(500).json({ message: "server error" })
   }
    return res.status(200).json({})
}

module.exports.downloadFile_get = async (req, res) => {
    // #swagger.description = 'Endpoint to download a single file'
    try {

     } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error" })
    }


}

module.exports.uploadFile_post = async (req, res) => {
    // #swagger.description = 'Endpoint to upload a file'
    try {
        
    } catch (err) {
       console.log(err)
       return res.status(500).json({ message: "server error" })
   }

}