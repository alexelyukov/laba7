const express = require('express')
const randomstring = require("randomstring")
const http = require('http')
const os = require('os');

require('dotenv').config()

const app = express()
const app_id = randomstring.generate()

const host = process.env.HOST || os.hostname()
const port = parseInt(process.env.PORT)

const registarHost = process.env.REGISTAR_HOST
const registarPort = parseInt(process.env.REGISTAR_PORT)

const state = {
    unique: Math.floor(Math.random() * 100),
    common: 0,
}

app.get('/', (req, res) => {
    logRequest(req);
    res.send(`Hello World from ${host}!`)
})

app.get('/set-common', function (req, res) {
    logRequest(req);
    state.common = parseInt(req.query.common)

    http.request({
        host: registarHost,
        port: registarPort,
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
    logRequest(req);
    state.common = parseInt(req.query.common)

    res.send(JSON.stringify({
        app_id,
        success: true,
    }))
})

app.get('/get-test', function (req, res) {
    logRequest(req);
    res.send(JSON.stringify({
        app_id,
        state,
        sum: parseInt(req.query.a) + parseInt(req.query.b),
    }))
})

const server = app.listen(port, () => {
    console.log(`Registering to http://${registarHost}:${registarPort}`)
    http.request({
        host: registarHost,
        port: registarPort,
        path: `/register?host=${host}&port=${port}`,
        method: 'GET'
    }).end()

    console.log(`Node app listening at http://${host}:${port}`)
})



// Using a single function to handle multiple signals
function close(signal) {
    console.log(`Received ${signal}`);
    http.request({
        host: registarHost,
        port: registarPort,
        path: `/unregister?host=${host}&port=${port}`,
        method: 'GET'
    }).end();
}

process.on('SIGINT', close);
process.on('SIGTERM', close);

function logRequest(req) {
    const path = req.url;
    const remoteIp = req.socket.remoteAddress;
    const headers = JSON.stringify(req.headers);
    const body = JSON.stringify(req.body);
    const date = Date.now();
    console.log(`${date} - [${remoteIp}]: ${path} headers: ${headers}, body: ${body}`);
}
