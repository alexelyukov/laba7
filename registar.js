const express = require('express')

require('dotenv').config()
const os = require('os');

const app = express()

const host = process.env.REGISTAR_HOST || os.hostname()
const port = parseInt(process.env.REGISTAR_PORT)

let services = []

app.get('/', (req, res) => {
    logRequest(req);
    res.send(`registar service on ${host}`)
})

app.get('/get-state', (req, res) => {
    logRequest(req);
    res.send(JSON.stringify({
        success: true,
        state: services,
    }))
})

app.get('/register', (req, res) => {
    logRequest(req);
    const serviceHost = req.query.host
    const servicePort = req.query.port
    console.log(`Registering ${serviceHost}:${servicePort}`);
    services.push({
        host: serviceHost,
        port: servicePort,
    })

    res.send(JSON.stringify({
        success: true,
        state: services,
    }))
})

app.get('/unregister', (req, res) => {
    logRequest(req);

    const serviceHost = req.query.host
    const servicePort = req.query.port
    console.log(`Unregistering ${serviceHost}:${servicePort}`);

    services = services.filter(elem => elem.host !== serviceHost || elem.port !== servicePort)

    res.send(JSON.stringify({
        success: true,
        state: services,
    }))
})

app.get('/healthcheck', function(req,res){
    logRequest(req);
    res.status(200).send("OK")
})

app.listen(port, host, () => {
    console.log(`Registar app listening at http://${host}:${port}`)
})

function logRequest(req) {
    const path = req.url;
    const remoteIp = req.socket.remoteAddress;
    const headers = JSON.stringify(req.headers);
    const body = JSON.stringify(req.body);
    const date = Date.now();
    console.log(`${date} - [${remoteIp}]: ${path} headers: ${headers}, body: ${body}`);
}
