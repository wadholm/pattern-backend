/* eslint-env mocha */
/** global: server */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

const mongoose = require('mongoose');

chai.should();

chai.use(chaiHttp);

let id;

before((done) => {
    mongoose.connection.collections.prices.drop(() => {
        done();
    });
});

describe('Prices model', () => {
    describe('GET /v1/prices', () => {
        it('200 HAPPY PATH for prices', (done) => {
            chai.request(server)
                .get("/v1/prices")
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('POST /v1/prices', () => {
        it('201 HAPPY PATH for adding price', (done) => {
            chai.request(server)
                .post(`/v1/prices`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("addedPrice");
                    res.body.should.have.property("message");
                    id = res.body.addedPrice._id;
                    res.body.message.should.equal("Succesfully added price");
                    done();
                });
        });
    });
    describe('PATCH /v1/prices/:id', () => {
        it('should get 200 updating price', (done) => {
            let updates = [
                {"propName": "discount", "value": 0.2}
            ];

            chai.request(server)
                .patch(`/v1/prices/${id}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Price succesfully updated");
                    done();
                });
        });
    });
});

