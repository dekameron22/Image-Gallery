const mongoose = require('mongoose')
const Image = require('../models/image')

require('./connection')

exports.create = function (img) {
    let entity = new Image (img)
    return entity.save()
}

exports.getAll = function () {
    return Image.find().exec()
}