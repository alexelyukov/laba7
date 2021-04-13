const express = require('express')
const randomstring = require("randomstring")
const http = require('http')

require('dotenv').config()

const app = express()
const app_id = randomstring.generate()

const host = process.env.HOST
const port = parseInt(process.env.PORT)

const registerHost = process.env.REGISTER_HOST
const registerPort = parseInt(process.env.REGISTER_PORT)

const state = {
    unique: Math.floor(Math.random() * 100),
    common: 0,
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/set-common', function (req, res) {
    state.common = parseInt(req.query.common)

    http.request({
        host: registerHost,
        port: registerPort,
        path: `/get-state`,
        method: 'GET'
    }, (response) => {
        let data = '';
        response.on('data', function (chunk) {
            data += chunk
        });

        response.on('end', function () {
            JSON.parse(data).state.forEach(element => {
                if (element.host === host && element.port === port) {
                    return;
                }

                http.request({
                    host: element.host,
                    port: element.port,
                    path: `/sync?common=${req.query.common}`,
                    method: 'GET'
                }).end();
            });
        });
        
    }).end()

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

const server = app.listen(port, () => {
    http.request({
        host: registerHost,
        port: registerPort,
        path: `/register?host=${host}&port=${port}`,
        method: 'GET'
    }).end()

    console.log(`Example app listening at http://${host}:${port}`)
})

server.on('close', function() {
    http.request({
        host: registerHost,
        port: registerPort,
        path: `/unregister?host=${host}&port=${port}`,
        method: 'GET'
    }).end()
})
  
process.on('SIGINT', function() {
    server.close()
})
