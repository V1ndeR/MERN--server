const auth = require("../middleware/Auth");
const file = require("../middleware/File");
const User = require("../models/User");
const File = require("../models/File");
const { Router } = require("express");
const path = require("path");
const router = Router()


router.post(
    '/upload',
    [auth, file.single('file')],
    async (req, res) => {
        try {
            const { creatorUserId, createdDate, postText } = req.body
            const { filename } = req.file
            const fileInfo = filename.split('.')

            if(!filename){
                return res.status(500).json("Ошибка при загрузке файла");
            }

            const { name: createdBy } = await User.findOne({ _id: creatorUserId })//

            const file = new File({ file: fileInfo[0], createdBy, createdDate, postText, type: fileInfo[fileInfo.length -1] })

            await file.save()

            // let fileData = req.file;

            res.status(201).json({ message: 'Файл загружен' })
        } catch (e) {
            res.status(500).json({ message: 'Ошибка при загрузке файла' })
        }
        // console.log(req.files)
        // console.log(req.body)
        // res.sendStatus(200);
    });

router.get(`/file/:fileId`, async (req, res) => {
    try {
        const { fileId } = req.params
        const { type } = await File.findOne({file: fileId})
        res.sendFile(`${fileId}.${type}`,{
            root: path.join(__dirname, '../static/')
        })
    } catch (e) {
        res.status(500).json({ message: 'Error'})
    }

})

router.get('/all', async (req, res) => {
    try {
        const files = await File.find()
        const page = req.query.page
        const limit = req.query.limit

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const resultPosts = files.slice(startIndex, endIndex)

        // console.log('NoSort',resultPosts)

        res.json(resultPosts)
    } catch (e) {

    }
})

router.get('/new', async (req, res) => {
    try {
        const files = await File.find()
        const sortResult = files.sort((a,b) => b.createdDate - a.createdDate)
        const page = req.query.page
        const limit = req.query.limit

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const resultPosts = sortResult.slice(startIndex, endIndex)

        res.json(resultPosts)
    } catch (e) {

    }
})



module.exports = router