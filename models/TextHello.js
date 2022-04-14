const {Schema, model} = require('mongoose')

const schema = new Schema({
    textHello: {type: String, required: true}
})

module.exports = model('Text',schema)