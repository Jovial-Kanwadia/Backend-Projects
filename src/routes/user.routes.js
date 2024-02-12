/* 
Routes define the URL endpoints of your application and specify which controller methods should 
handle requests to those endpoints. They act as a bridge between the incoming HTTP requests and 
the corresponding controller logic.
*/

import { Router } from "express";
import { registerUser} from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js";
import {uploadOnCloudinary} from "../utils/Cloudinary.js"



const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )
//=> http://localhost:8000/api/v1/users/register will run registerUser method from user.controller
// router.route("/register").post( middleware, controller)
/* 
 upload middleware is the multer we defined in multer.middleware.js 
 we can use different methods to upload files like single, array, fields etc...
*/



export default router
//This router is exported to app.js and there it is imported as userRouter