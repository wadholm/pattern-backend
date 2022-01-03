/* eslint-env mocha */
/** global: server */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

const mongoose = require('mongoose');

chai.should();

chai.use(chaiHttp);


before((done) => {
    mongoose.connection.collections.api_users.drop(() => {
        done();
    });
});

describe('Api Users model', () => {
    describe('POST /v1/api/register', () => {
        it('should get 200 for missing email', (done) => {
            let user = {
            };

            chai.request(server)
                .post("/v1/api/register")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    done();
                });
        });
        it('should get 200 registering api user', (done) => {
            let user = {
                email: "test@example.com"
            };

            chai.request(server)
                .post("/v1/api/register")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    done();
                });
        });
        it('should get 200 for api user already exists', (done) => {
            let user = {
                email: "test@example.com"
            };

            chai.request(server)
                .post("/v1/api/register")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe('POST /v1/api/deregister', () => {
        it('should get 200 deregistering api user', (done) => {
            let user = {
                email: "test@example.com"
            };

            chai.request(server)
                .post("/v1/api/deregister")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe('GET /v1/api/key', () => {
        it('200 HAPPY PATH register for API key', (done) => {
            chai.request(server)
                .get("/v1/api/key")
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe('GET /v1/api/key/deregister', () => {
        it('200 HAPPY PATH deregister for API key', (done) => {
            chai.request(server)
                .get("/v1/api/key/deregister")
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

