var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./src/config');
var databaseUtils = require('./src/utils/database');


const databaseURI = databaseUtils.buildURI(config.database.protocol, config.database.host, config.database.port, config.database.name);
mongoose.connect(databaseURI);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('TooDue API is listening on port 3000');
});
