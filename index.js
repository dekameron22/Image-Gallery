const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const request = require('request')
const fs = require('fs')
const url = require('url')
const mime = require('mime-types')
const sharp = require('sharp')
const dbManager = require('./db/dbManager')
require('dotenv').config()

app.use(bodyParser.json({
    limit: '1mb',
    extended: false
}))

const elmsPerPage = 2

let download = (uri) => {
    return new Promise((resolve, reject) => {
        request.head(uri, (err, res, body) => {
            // console.log('content-type:', res.headers['content-type'])
            if (res.headers['content-length'] > 10000000) reject('Image is too large')
            const parsed = url.parse(uri)
            let filename = path.basename(parsed.pathname)
            let filenameWithoutExtension
            if (!filename.includes('.')) {
                filenameWithoutExtension = filename
                filename += '.' + mime.extension(res.headers['content-type'])
            } else filenameWithoutExtension = filename.split('.').slice(0, -1).join('.')
            const pathname = './images/' + filename

            const thumbnail = sharp().resize(500, 400)
            request(uri).pipe(thumbnail).pipe(fs.createWriteStream(pathname)).on('close', () => resolve({
                filename: filenameWithoutExtension,
                size: res.headers['content-length'],
                mimetype: res.headers['content-type'],
                pathname
            }))
        })
    })
}

// app.use(express.static(path.join(__dirname + '/client/', 'build')))

app.get('/api', async (req, res) => {
    let start = parseInt(req.query.start)
    if (!start) start = 0
    try {
        const dbImgs = await dbManager.getAll()
        let imgs = []
        for (let dbImg of dbImgs) {
            const bitmap = fs.readFileSync(dbImg.path)
            const src = 'data:' + dbImg.mimetype + ';base64,' + Buffer.from(bitmap).toString('base64')
            let img = {
                name: dbImg.name,
                size: dbImg.size,
                date: dbImg.date,
                id: dbImg.id,
                src
            }
            imgs.push(img)
        }
        imgs = imgs.slice(start * elmsPerPage, start * elmsPerPage + elmsPerPage)
        res.json({ images: imgs })
    } catch (err) {
        console.log('ERROR: ' + err)
        res.status(400).json({ message: err })
    }
})

app.post('/api', async (req, res) => {
    if (!req.body.uri) res.status(400).json({ message: 'Uri missing!' })
    try {
        let data = await download(req.body.uri)
        let img = {
            name: data.filename,
            path: data.pathname,
            size: data.size,
            mimetype: data.mimetype,
            date: Date.now()
        }
        await dbManager.create(img)
        res.json({ message: 'Image was uploaded successfully: name - ' + data.filename + ', size - ' + data.size })
    } catch (err) {
        res.status(400).json({ message: err })
    }
})

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname + '/client/build/index.html'))
// })

app.listen(process.env.PORT || 8080, () => {
    console.log('server is listening at %s', process.env.PORT)
})