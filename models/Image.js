const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    image: {type: String},
    createdBy: {type: String}
})

const Image = new mongoose.model('Image', imageSchema)
module.exports = Image