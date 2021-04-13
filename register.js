const express = require('express')

require('dotenv').config()

const app = express()

const host = process.env.REGISTER_HOST
const port = parseInt(process.env.REGISTER_PORT)

let services = []

app.get('/', (req, res) => {
    res.send('register service')
})

app.get('/get-state', (req, res) => {
    res.send(JSON.stringify({
        success: true,
        state: services,
    }))
})

app.get('/register', (req, res) => {
    const serviceHost = req.query.host
    const servicePort = req.query.port

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
    const serviceHost = req.query.host
    const servicePort = req.query.port

    services = services.filter(elem => elem.host !== serviceHost || elem.port !== servicePort)

    res.send(JSON.stringify({
        success: true,
        state: services,
    }))
})

app.listen(port, host, () => {
    console.log(`Example app listening at http://${host}:${port}`)
})
