const multer = require("multer")
const {v4: uuidv4} = require("uuid");

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "static");
    },
    filename: (req, file, cb) =>{
        const { v4: uuidv4 } = require('uuid');
        const randomName = uuidv4();

        const origName = file.originalname
        const nameSplit = origName.split('.')

        cb(null, randomName + "." + nameSplit[nameSplit.length -1]);
    }
});

const fileFilter = (req, file, cb) => {

    if(file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "video/mp4" ||
        file.mimetype === "video/x-m4v" ||
        file.mimetype === "video/*"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

module.exports = multer({storage, fileFilter})