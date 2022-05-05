const auth = require("../middleware/Auth");
const file = require("../middleware/File");
const User = require("../models/User");
const Image = require("../models/Image");
const {Router} = require("express");
const path = require("path");
const router = Router()


router.post(
    '/upload',
    [auth, file.single('img')],
    async (req, res) => {
        try {
            const { creatorUserId } = req.body
            const { filename } = req.file
            const fileInfo = filename.split('.')

            if(!filename){
                return res.status(500).json("Ошибка при загрузке файла");
            }

            const { name: createdBy } = await User.findOne({ _id: creatorUserId })//

            // console.log('createdBy',createdBy)

            const image = new Image({ image: fileInfo[0], createdBy, type: fileInfo[fileInfo.length -1] })

            await image.save()

            // let fileData = req.file;

            res.status(201).json({ message: 'Файл загружен' })
        } catch (e) {
            res.status(500).json({ message: 'Ошибка при загрузке файла' })
        }
        // console.log(req.files)
        // console.log(req.body)
        // res.sendStatus(200);
    });

router.get(`/img/:imageId`, async (req, res) => {
    try {
        const { imageId } = req.params
        const {type} = await Image.findOne({image: imageId})
        res.sendFile(`${imageId}.${type}`,{
            root: path.join(__dirname, '../static/')
        })
    } catch (e) {
        res.status(500).json({ message: 'Error'})
    }

})

router.get('/all', async (req, res) => {
    try {
        const images = await Image.find()

        // console.log(images)
        res.json(images)
    } catch (e) {

    }
})



module.exports = router