/*
This file has a function "uploadOnCloudinary(path)" which will take path
of images as input and upload them on cloudinary
*/
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//Method to give locale path to cloudinary and unlink the uploaded file
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        
        //Upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        
        console.log("File uploaded to cloudinary", response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        //Remove the locale file as the upload process failed
        return null
    }
}

export {uploadOnCloudinary}

  /*
  Cloudinary is a 3rd party service to save uploaded files, img etc
  Multer and fileExpress are packages that are used to direct and upload files
  1) We will recieve file uploaded by user through multer
  2) Then temporarily save these files on our server
  3) Cloudinary will take files from our locale server
  */