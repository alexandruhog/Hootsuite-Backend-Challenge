"use strict";

const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp'); //for audit purpouses
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    users: [String], //used array of users for better indexing
    sender: {
        type: Number,
        required: true
    },
    receiver: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    sum: {
        type: Number,
        required: true
    }
}, {
    autoIndex: false
});

transactionSchema.plugin(timestamps); //for logging purpouses
transactionSchema.index({
    users: 1,
    sum: -1
});
// set the indexes for users first because it's the main query
// and for sum descending because i need higher sums first

module.exports = mongoose.model('Transactions', transactionSchema);
