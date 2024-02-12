import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })

  /* 
  Destination specifies the directory where uploaded files will be stored
  Filename determines the name of the uploaded file on the server. Here, it's set to the original name of the file.
  */
  
export const upload = multer({ 
    storage, 
})
// Now we can use upload.<properties of multer> in routes as a middleware