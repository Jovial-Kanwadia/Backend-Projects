/* 
They contain the code that processes incoming requests, 
interacts with the data model (database or other storage), and 
sends a response back.
    Extract data from the incoming request (e.g., parameters, body).
    Invoke relevant services or business logic.
    Interact with the data model (database operations).
    Construct the response to send back to the client.
*/

import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler( async (req, res) => {
    // 1) Get user details from frontend
    const {fullName, email, password, username} = req.body
    // console.log("\nWhat is inside req.body : ", req.body)
    // console.log("\nWhat is inside req : ", req)

    // 2) Validation
    // if(fullName === ""){
    //     throw new ApiError(400, "FullName is required")
    // }
    if([fullName, email, password, username].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    // 3) Check if user already exist: email, username
    //User.findOne(query) <= It will return the document that has same username or email
    const existingUser = await User.findOne({
        $or: [{ username },{ email }]
    })
    if(existingUser){
        throw new ApiError(409, "User with this username or email already exist")
    }

    // 4) Check for images and avatar
    // req.files? <= Multer gives you access to files in the local system
    // avatar[0]?.path <= avatar's first property has an object which will give you it's path that was uploaded by multer 
    const avatarLocalPath = req.files?.avatar[0]?.path;

    //We cannot use this method from coverImage because coverImage is optional to upload by user
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar field is required")
    }
    
    
    // 5) Upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar field is required")
    }

    // 6) Create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    // 7) Remove password and refresh token field from response
    // 8) Check if the entry in db was successful
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //Fields present in the "select" will not we included in the response 
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    } 

    // 9) Return response using ApiResponse file
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser}

//============Steps to register user=============//
// 1) Get user details from frontend
// 2) Validation
// 3) Check if user already exist: email, username
// 4) Check for images and avatar
// 5) Upload them to cloudinary
// 6) Create user object - create entry in db
// 7) Remove password and refresh token field from response
// 8) Check if the entry in db was successful
// 9) Return response


/*
===========console.log("\nInside req.files : ",req.files)==============
Inside req.files :  [Object: null prototype] {
  avatar: [
    {
      fieldname: 'avatar',
      originalname: 'IMG_20231015_235425_984.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './public/temp',
      filename: 'IMG_20231015_235425_984.jpg',
      path: 'public\\temp\\IMG_20231015_235425_984.jpg',
      size: 3289508
    }
  ],
  coverImage: [
    {
      fieldname: 'coverImage',
      originalname: 'WIN_20230912_20_25_48_Pro.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './public/temp',
      filename: 'WIN_20230912_20_25_48_Pro.jpg',
      path: 'public\\temp\\WIN_20230912_20_25_48_Pro.jpg',
      size: 721694
    }
  ]
}
*/