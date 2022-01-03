/* eslint-env mocha */
/** global: server */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

const mongoose = require('mongoose');

chai.should();

chai.use(chaiHttp);

let token;
let id;

before((done) => {
    mongoose.connection.collections.admins.drop(() => {
        done();
    });
});

describe('Admins model', () => {
    describe('POST /v1/admins/register', () => {
        it('should get 201 registering an admin', (done) => {
            let admin = {
                username: "admin1",
                password: "admin123"
            };

            chai.request(server)
                .post("/v1/admins/register")
                .send(admin)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("createdAdmin");
                    res.body.should.have.property("message");
                    id = res.body.createdAdmin._id;
                    res.body.message.should.equal("Succesfully created an admin");
                    done();
                });
        });
    });
    describe('POST /v1/admins/login', () => {
        it('should get 200 loging in admin', (done) => {
            let user = {
                username: "admin1",
                password: "admin123"
            };

            chai.request(server)
                .post("/v1/admins/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("token");
                    token = res.body.token;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Auth succesful");
                    done();
                });
        });
    });
    describe('GET /v1/admins', () => {
        it('200 HAPPY PATH for admins', (done) => {
            chai.request(server)
                .get("/v1/admins")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('GET /v1/admins/:id', () => {
        it('200 HAPPY PATH for admins by id', (done) => {
            chai.request(server)
                .get(`/v1/admins/${id}`)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('PATCH /v1/admins/:id', () => {
        it('should get 200 updating admin', (done) => {
            let updates = [
                {"propName": "username", "value": "admin2"}
            ];

            chai.request(server)
                .patch(`/v1/admins/${id}`)
                .send(updates)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Admin succesfully updated");
                    done();
                });
        });
    });
});

