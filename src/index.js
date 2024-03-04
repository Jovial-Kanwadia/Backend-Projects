// Entry point 
// We connect our database here

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'

import {logEvent} from './logEvent.js'
import {EventEmitter} from 'events'
class MyEmitter extends EventEmitter {}

// import 'dotenv/config'
dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection failed!", err)
    // console.log(err)
})

//Initialize Object
const myEmitter = new MyEmitter();

//Add event listener for log event
myEmitter.on('log', (message) => logEvent(message))

//Emit Event
myEmitter.emit('log', 'Log Event Emitted!')