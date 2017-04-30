process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Transaction = require('../models/transactions');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Transactions', () => {
    beforeEach((done) => { //Before each test I empty the database
        Transaction.remove({}, (err) => {
            done();
        });
    });

    describe('/GET transactions without all parameters', () => {
        it('it should not GET anything', (done) => {
            chai.request(server)
                .get('/transactions')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql(`Cast to number failed for value \"undefined\" at path \"sum\" for model \"Transactions\"`);
                    done();
                });
        });
    });

    describe('/GET transactions with proper query parameters', () => {
        it('it should GET a null array -- 0/0', (done) => {
            chai.request(server)
                .get('/transactions')
                .query({
                    'user': 123,
                    'day': 26,
                    'treshold': 222
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                })
        });
        it('it should GET all the transactions with the specified parameters -- 2/2', (done) => {
            let transaction1 = {
                users: [234, 123],
                sender: 234,
                receiver: 123,
                date: new Date(1489104000 * 1000),
                sum: 229
            };
            let transaction2 = {
                users: [123, 245],
                sender: 123,
                receiver: 245,
                date: new Date(1489104000 * 1000),
                sum: 4213
            }
            Transaction.insertMany([transaction1, transaction2], (err, trans) => {

                chai.request(server)
                    .get('/transactions')
                    .query({
                        'user': 123,
                        'day': 10,
                        'treshold': 222
                    })
                    .send(trans)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(2);
                        res.body[0].should.have.a.property('_id');
                        res.body[0].should.have.a.property('sender');
                        res.body[0].should.have.a.property('receiver');
                        res.body[0].should.have.a.property('date');
                        res.body[0].should.have.a.property('sum');
                        done();
                    })
            })
        })
        it('it should GET all the transactions with the specified parameters -- 2/3', (done) => {
            let transaction1 = {
                users: [234, 123],
                sender: 234,
                receiver: 123,
                date: new Date(1489104000 * 1000),
                sum: 229
            };
            let transaction2 = {
                users: [123, 245],
                sender: 123,
                receiver: 245,
                date: new Date(1489104000 * 1000),
                sum: 4213
            };
            let transaction3 = {
              users: [459, 245],
              sender: 459,
              receiver: 245,
              date: new Date(1489104000 * 1000),
              sum: 4213
            };
            Transaction.insertMany([transaction1, transaction2, transaction3], (err, trans) => {

                chai.request(server)
                    .get('/transactions')
                    .query({
                        'user': 123,
                        'day': 10,
                        'treshold': 222
                    })
                    .send(trans)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(2);
                        res.body[0].should.have.a.property('_id');
                        res.body[0].should.have.a.property('sender');
                        res.body[0].should.have.a.property('receiver');
                        res.body[0].should.have.a.property('date');
                        res.body[0].should.have.a.property('sum');
                        done();
                    })
            })
        })
    });
    describe('POST /transactions', () => {
        it('it should not POST a transaction without receiver', (done) => {
            let transaction = {
                sender: 123,
                timestamp: 1489104000,
                sum: 229
            };
            chai.request(server)
                .post('/transactions')
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('receiver');
                    res.body.errors.receiver.should.have.property('kind').eql('required');
                    done();
                })
        });
        it('it should not POST a transaction without sender', (done) => {
            let transaction = {
                receiver: 123,
                timestamp: 1489104000,
                sum: 229
            };
            chai.request(server)
                .post('/transactions')
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('sender');
                    res.body.errors.sender.should.have.property('kind').eql('required');
                    done();
                })
        });
        it('it should not POST a transaction without date', (done) => {
            let transaction = {
                sender: 123,
                receiver: 50,
                sum: 229
            };
            chai.request(server)
                .post('/transactions')
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('date');
                    res.body.errors.date.should.have.property('kind').eql('Date');
                    done();
                })
        });
        it('it should not POST a transaction without sum', (done) => {
            let transaction = {
                sender: 123,
                receiver: 50,
                timestamp: 1489104000
            };
            chai.request(server)
                .post('/transactions')
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('sum');
                    res.body.errors.sum.should.have.property('kind').eql('required');
                    done();
                })
        });
        it('it should POST a transaction with all 4 parameters inputted', (done) => {
            let transaction = {
                sender: 123,
                receiver: 250,
                timestamp: 1489104000,
                sum: 229
            };
            chai.request(server)
                .post('/transactions')
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('receiver');
                    res.body.should.have.property('sender');
                    res.body.should.have.property('sum');
                    res.body.should.have.property('date');
                    res.body.sender.should.equal(123);
                    done();
                })
        })
    })

});
describe('/GET balance without all parameters', () => {
    it('it should not GET anything', (done) => {
        chai.request(server)
            .get('/balance')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name').eql(`CastError`);
                done();
            });
    });
});
describe('/GET balance with proper parameters', () => {
    it('it should GET 0 balance if no entries', (done) => {
        chai.request(server)
            .get('/balance')
            .query({
                'user': 123,
                'from': 1491004800,
                'until': 1493282615
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('balance');
                res.body.balance.should.be.eql(0);
                done();
            })
    });
    it('it should GET negative balance', (done) => {
        let transaction = new Transaction({
            users: [234, 123],
            sender: 234,
            receiver: 123,
            date: new Date(1489104000 * 1000),
            sum: 229
        });
        transaction.save((err, trans) => {

            chai.request(server)
                .get('/balance')
                .query({
                    'user': 234,
                    'from': 1489103999,
                    'until': 1493282615
                })
                .send(trans)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('balance');
                    res.body.balance.should.be.eql(-229);
                    done();
                })
        })
    })
    it('it should GET positive balance', (done) => {
        let transaction = new Transaction({
            users: [234, 123],
            sender: 234,
            receiver: 123,
            date: new Date(1489104000 * 1000),
            sum: 229
        });
        transaction.save((err, trans) => {

            chai.request(server)
                .get('/balance')
                .query({
                    'user': 123,
                    'from': 1489103999,
                    'until': 1493282615
                })
                .send(trans)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('balance');
                    res.body.balance.should.be.eql(229);
                    done();
                })
        })
    })
});
