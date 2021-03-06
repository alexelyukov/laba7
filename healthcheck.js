var http = require("http");
const os = require('os');
const host = process.env.HOST || os.hostname()

var options = {
    host: host,
    port: process.env.REGISTAR_HOST ? process.env.PORT : process.env.REGISTAR_PORT,
    timeout: 5000,
    path: "/healthcheck",
};

var request = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode == 200) {
        process.exit(0);
    }
    else {
        process.exit(1);
    }
});

request.on('error', function(err){
    console.log(err);
    process.exit(1);
});

request.end();
