const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const auth = require("./middleware/Auth")
const cors = require("cors")

const app = express()

app.use(express.json({ extended: true }))

app.use(cors())

app.use('/api/auth', require('./routes/auth.routes'))

// це ответ сервера (response)
app.get('/health-check', async (req, res) => {
    res.send({
        name: 'name',
        cars: [
            'BMW 5',
            'Audi'
        ]
    })
})

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()

