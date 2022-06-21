const {Schema, model} = require('mongoose')

const imageSchema = new Schema({
    file: {type: String},
    type: {type: String},
    createdBy: {type: String},
    createdDate: {type: String},
    postText: {type: String}
})

module.exports = model('File',imageSchema)