const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "static");
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if(file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"||
        file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

module.exports = multer({storage, fileFilter})