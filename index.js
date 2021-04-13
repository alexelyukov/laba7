const express = require('express')
const randomstring = require("randomstring")
const http = require('http')
const os = require('os')

require('dotenv').config()

const app = express()
const app_id = randomstring.generate()

const host = os.hostname()
const port = parseInt(process.env.PORT)

const clusters = JSON.parse(process.env.CLUSTERS)
const cluster = clusters.find((elem) => elem === `${host}:${port}`)

const state = {
    unique: Math.floor(Math.random() * 100),
    common: 0,
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/set-common', function (req, res) {
    state.common = parseInt(req.query.common)

    clusters.forEach(element => {
        if (element === cluster) {
            return;
        }

        const [elementHost, elementPort] = element.split(':')

        http.request({
            host: elementHost,
            port: elementPort,
            path: `/sync?common=${req.query.common}`,
            method: 'GET'
        }, (response) => {
            // console.log(response.body)
        }).end();
    });

    res.send(JSON.stringify({
        app_id,
        success: true,
    }))
})

app.get('/sync', function (req, res) {
    state.common = parseInt(req.query.common)

    res.send(JSON.stringify({
        app_id,
        success: true,
    }))
})

app.get('/get-test', function (req, res) {
    res.send(JSON.stringify({
        app_id,
        state,
        sum: parseInt(req.query.a) + parseInt(req.query.b),
    }))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
