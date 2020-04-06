// External dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// App dependencies
const authController = require('./controllers/auth');
const config = require('./config');
const databaseUtils = require('./utils/database');

// Connect to database
const databaseURI = databaseUtils.buildURI(config.database.protocol, config.database.host, config.database.port, config.database.name);
mongoose.connect(databaseURI);

// Setup app
const app = express();

// Setup middleware
app.use(bodyParser.json());

// Setup routes
app.use('/auth', authController);

module.exports = app;
