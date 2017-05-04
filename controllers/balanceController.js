"use strict";

const Transaction = require('../models/transactions');
const wrap = require('co-express');


exports.getBalance = wrap(function*(req, res, next) {
    const user = req.query.user;
    let balance = 0;
    const lowerDate = new Date(req.query.from * 1000);
    const higherDate = new Date(req.query.until * 1000);
    try {
        const transactions = yield Transaction.find({
            $and: [{
                    date: {
                        $gte: lowerDate,
                        $lte: higherDate
                    }
                },
                {
                  users: user
                }
            ]
        }).select("-users -_id").lean();

        // used lean for increased performance (removed the mongoose overhead)
        // used select ('-users') for not sending it as a response

        // computed the balance using reduce functional for performance
        balance = transactions.reduce((sumAcc, el) => {
                if (el.sender == user) {
                    sumAcc -= el.sum;
                } else {
                    sumAcc += el.sum;
                }
                return sumAcc;
            },
            0
        );
        res.json({
            balance: balance
        });
    } catch (err) {
        res.json(err);
    }
});
