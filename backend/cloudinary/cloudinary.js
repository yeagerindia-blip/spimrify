import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const uploadImageOnCloudinary = async(filePath)=>{
    try {
        let upload = await cloudinary.uploader.upload(filePath)
        console.log(upload)
        fs.unlinkSync(filePath)
        return upload.secure_url
    } catch (error) {
        console.log(error)
        fs.unlinkSync(filePath)
        
    }
}

export default uploadImageOnCloudinary