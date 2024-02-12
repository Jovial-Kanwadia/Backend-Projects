import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
//jsonwebtoken is a bearer token, anyone who has this token can access the data in db
//It behaves like a key
import bcrypt from "bcrypt"
//bcrypt is used to incrypt the password entered by the user before saving it

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true, 
    },
    fullName: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
    },
    //Watch history is a array because we have to store multiple values
    //This will log the id's of the video watched by the user
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
})

//Pre middleware help to do stuff before 'saving', 'updating'... etc your data
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next(); //This condition checks if the password is created or modified

    this.password = await bcrypt.hash(this.password, 10) //If modified then it crypts the new password before saving it in the db
    next()
})

//Checks if the password entered by the user is correct or not
//This is a custom method and 'password' is entered by user 'this.password' is the crypt form saved in the db
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password) //bcrypt compare returns 0 or 1 
}

//This is a method to generate Access Token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
/* jwt.sign() Helps in generating tokens 
    1) Payload
    2) Access Token
    3) An object with expiry of access token
*/



userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)
// User can directly communicate with the db 