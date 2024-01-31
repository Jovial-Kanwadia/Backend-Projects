// Entry point 
// We connect our database here


import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'

// require('dotenv').config({ path: './env'})

import 'dotenv/config'

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection failed!", err)
})