const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Image = require('../models/Image')
const router = Router()
const auth = require('../middleware/Auth')
const file = require('../middleware/File')

router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({ min: 6 })
    ],// axios
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регестрации'
            })
        }

        const { email, password, name } = req.body

        const candidate = await User.findOne({ email })

        if (candidate) {
            return res.status(400).json({ message: 'Такой пользователь уже существует' })
        }

        const hashedPassword = await bcrypt.hash(password, 8)

        const user = new User({ email, password: hashedPassword, name })

        await user.save()

        res.status(201).json({ message: 'Пользователь создан' })
        
    } catch (e) {
        res.status(500).json({ message: 'Ошибка' })
    }
})

router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' })
        }

        const comparison = await bcrypt.compare(password, user.password)

        if (!comparison) {
            return res.status(400).json({ message: 'Неверный пароль'})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )

        res.json({ token, userId: user.id})

    } catch (e) {
        res.status(500).json({ message: 'Ошибка' })
    }
})

router.post("/authheathcheck", auth, async (req, res) => {
    res.status(200).send({
        auth: 'authheathcheck'
    });
});

router.post(
    '/upload',
    [auth, file.single('img')],
    async (req, res) => {
        try {
            const { userId } = req.body
            const { filename } = req.file
            // console.log(filename)
            if(!filename){
                return res.status(500).json("Ошибка при загрузке файла");
            }

            const image = new Image({ image: filename, createdBy: userId })

            await image.save()

            // let fileData = req.file;

            res.status(201).json({ message: 'Файл загружен' })
        } catch (e) {
            res.status(500).json({ message: 'Ошибка' })
        }
        // console.log(req.files)
        // console.log(req.body)
    // res.sendStatus(200);
});

module.exports = router