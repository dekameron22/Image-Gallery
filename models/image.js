const mongoose = require('mongoose')

let Image = mongoose.model('Image', {
    name: String,
    path: String,
    size: Number,
    mimetype: String,
    date: Date
})

module.exports = Image