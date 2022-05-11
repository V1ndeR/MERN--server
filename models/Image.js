const {Schema, model} = require('mongoose')

const imageSchema = new Schema({
    image: {type: String},
    type: {type: String},
    createdBy: {type: String}
})

module.exports = model('Image',imageSchema)