const request = require('request')
const url = require('url')
const mime = require('mime-types')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const download = (uri) => {
    return new Promise((resolve, reject) => {
        request.head(uri, (err, res, body) => {
            if (res.headers['content-length'] > 10000000) reject('Image is too large')
            const parsed = url.parse(uri)
            let filename = path.basename(parsed.pathname)
            let filenameWithoutExtension
            if (!filename.includes('.')) {
                filenameWithoutExtension = filename
                filename += '.' + mime.extension(res.headers['content-type'])
            } else filenameWithoutExtension = filename.split('.').slice(0, -1).join('.')
            const pathname = './images/' + filename

            const thumbnail = sharp().resize(500, 400).on('info', (info) => {
                resolve({
                    filename: filenameWithoutExtension,
                    size: info.size,
                    mimetype: res.headers['content-type'],
                    pathname
                })
            })
            request(uri).pipe(thumbnail).pipe(fs.createWriteStream(pathname)).on('close', () => console.log('done saving image'))
        })
    })
}

module.exports = download