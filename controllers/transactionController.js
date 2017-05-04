"use strict"

const Transaction = require('../models/transactions');
const wrap = require('co-express');

exports.insert = function(req, res, next) {

    const transaction = new Transaction({
        users: [req.body.sender, req.body.receiver],
        sender: req.body.sender,
        receiver: req.body.receiver,
        date: new Date(req.body.timestamp * 1000),
        sum: req.body.sum
    });
    transaction.save((err, newTrans) => {
        if (err)
            res.json(err);
        res.json(newTrans);
    })
}

exports.getTrans = wrap(function*(req, res, next) {
    const user = req.query.user;
    const day = req.query.day;
    const treshold = req.query.treshold;
    try {
        const userTransactions = yield Transaction.find({
            $and: [{
                    users: user
                },
                {
                    sum: {
                        $gt: treshold
                    }
                }
            ]
        }).select("-users -_id").lean();
        // used lean for increased performance (removed the mongoose overhead)
        // used select ('-users') for not sending it as a response

        const myTrans = userTransactions.filter((transaction) => {
            return transaction.date.getDate() == day;
        });

        res.json(myTrans);
    } catch (err) {
        res.json(err);
    }
});
