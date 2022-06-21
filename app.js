const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require("path")

const app = express()

app.use(express.json({ extended: true }))

app.use(cors())

app.use('/static', express.static(path.join(__dirname, 'file')))

app.use('/api/auth', require('./routes/auth.routes'))

app.use('/api/files', require('./routes/files.routes'))


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

