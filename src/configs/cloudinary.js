const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const getPublicId = (url) => {
    return url.split("/").pop().split(".")[0]
}

const uploadFile = async (file) => {
    try {
        let path = file.path
        const uploadedFile = await cloudinary.uploader.upload(path, { folder: "rise-assessment" })
        console.log(uploadedFile)
        const uploadedFileSrc = uploadedFile.secure_url
        return uploadedFileSrc
    } catch (e) {
        console.log(e)
        return ""
    }
}

const deleteCloudinaryFile = async (url) => {
    if (url && url.includes("cloudinary")) {
        const publicId = getPublicId(url)
        await cloudinary.uploader.destroy(`rise-assessment/${publicId}`)
    }

}



module.exports={uploadFile, deleteCloudinaryFile}