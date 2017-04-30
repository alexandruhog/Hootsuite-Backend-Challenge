"use strict";

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./route');
const helmet = require('helmet');
const mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = require('bluebird');
mongoose.set('debug', true);
mongoose.connect(config.DBHost, (err) => {
    if (err) console.log(err);
    else console.log(`Connection is: ${config.DBHost}`);
});
const app = express();

if (config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('dev'));
}
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


router(app);

module.exports = app;
