const express = require('express')
const randomstring = require("randomstring")
const http = require('http')

require('dotenv').config()

const app = express()
const cluster = JSON.parse(process.env.CLUSTER)
const port = cluster[parseInt(process.env.CLUSTER_ID) - 1]
const app_id = randomstring.generate();
const state = {
    unique: Math.floor(Math.random() * 100),
    common: 0,
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/set-common', function (req, res) {
    state.common = parseInt(req.query.common)

    cluster.forEach(element => {
        if (element === port) {
            return;
        }

        http.request({
            host: 'localhost',
            port: element,
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
