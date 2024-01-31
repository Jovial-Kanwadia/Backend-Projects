// This file is used for configurations, cookies, urlencoded 

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// Enable Cross-Origin Resource Sharing (CORS) middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,  // Set the allowed origin
    credentials: true  // Allow credentials (cookies, HTTP authentication) to be sent with requests
}))


// This line helps you recieve JSON requests with a limit of 16kb
app.use(express.json({ limit: "16kb"}))

// This line helps you recieve URL-encoded requests with a limit of 16kb and enable extended parsing of URL-encoded data
//extended true means we can send objects inside objects etc...
app.use(express.urlencoded({extended: true, limit: "16kb"}))

// If we want to store files or folders on our server then it will be stored in "public"
app.use(express.static("public"))

// Parse cookies using cookie-parser middleware
app.use(cookieParser())

export { app } 


/* Once the JSON data is extracted, it needs to be parsed 
into a format that the server-side programming language can work with.
The parsed JSON data is usually converted into a native data structure, such as an object or a dictionary, 
depending on the programming language. */