"use strict";
const express = require('express');
const transactionsController = require('./controllers/transactionController');
const balanceController = require('./controllers/balanceController');

module.exports = function(app) {
    const apiRoutes = express.Router();

    apiRoutes.post('/transactions', transactionsController.insert);
    apiRoutes.get('/transactions', transactionsController.getTrans);
    apiRoutes.get('/balance', balanceController.getBalance);

    app.use('/', apiRoutes);
}
