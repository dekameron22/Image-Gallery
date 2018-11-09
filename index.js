const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const dbManager = require('./db/dbManager')
const download = require('./downloadImg')
require('dotenv').config()

app.use(bodyParser.json({
    limit: '1mb',
    extended: false
}))

app.use(express.static(path.join(__dirname + '/client/', 'build')))

const elmsPerPage = 2

const getImgs = async () => {
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
    return imgs
}

app.get('/api', async (req, res) => {
    let start = parseInt(req.query.start)
    if (!start) start = 0
    try {
        let imgs = await getImgs()

        if (!req.query.sort || req.query.sort === 'date') imgs.sort((a, b) => b.date - a.date)
        else if (req.query.sort === 'name') imgs.sort((a, b) => a.name.localeCompare(b.name))
        else if (req.query.sort === 'size') imgs.sort((a, b) => a.size - b.size)

        if (req.query.search) imgs = imgs.filter(img => img.name.toLowerCase().includes(req.query.search.toLowerCase()))

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

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

app.listen(process.env.PORT || 8080, () => {
    console.log('server is listening at %s', process.env.PORT)
})