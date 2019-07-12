let express = require('express');
let app = express();
let cors = require('cors')
let envConfig = require('./devconfig')
app.use(cors());
let ithours = require('ithours')
var config = {
    environment: 'environment.json'
}
var process = require('process');
process.on('uncaughtException', function(err) {
    console.log("uncaughtException occured" + JSON.stringify(err));
})
var itHoursModule = ithours.bootstrap(app, config);
app.listen(envConfig.port)