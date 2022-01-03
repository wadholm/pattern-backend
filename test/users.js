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
let fakeId = "619f6ee3d0b6c914a2b58513";

before((done) => {
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});

describe('Users model', () => {
    describe('POST /v1/users/register', () => {
        it('should get 401 for missing email', (done) => {
            let user = {
                password: "test"
            };

            chai.request(server)
                .post("/v1/users/register")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(401);
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Email or password missing.");
                    done();
                });
        });
        it('should get 201 registering user', (done) => {
            let user = {
                firstname: "John",
                lastname: "Doe",
                email: "test@example.com",
                password: "123test"
            };

            chai.request(server)
                .post("/v1/users/register")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("createdUser");
                    res.body.should.have.property("message");
                    id = res.body.createdUser._id;
                    res.body.message.should.equal("Succesfully created a user");
                    done();
                });
        });
        it('should get 409 for user already exists', (done) => {
            let user = {
                firstname: "John",
                lastname: "Doe",
                email: "test@example.com",
                password: "123test"
            };

            chai.request(server)
                .post("/v1/users/register")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(409);
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Email already exists");
                    done();
                });
        });
        it('should get 500 for required fields missing', (done) => {
            let user = {
                email: "test2@example.com",
                password: "123test"
            };

            chai.request(server)
                .post("/v1/users/register")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(500);
                    done();
                });
        });
    });
    describe('POST /v1/users/login', () => {
        it('should get 200 loging in user', (done) => {
            let user = {
                email: "test@example.com",
                password: "123test"
            };

            chai.request(server)
                .post("/v1/users/login")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("token");
                    token = res.body.token;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Auth succesful");
                    done();
                });
        });
        it('should get 401 loging in non existing user', (done) => {
            let user = {
                email: "test1@example.com",
                password: "123test"
            };

            chai.request(server)
                .post("/v1/users/login")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Auth failed");
                    done();
                });
        });
        it('should get 401 loging in user with incorrect password', (done) => {
            let user = {
                email: "test@example.com",
                password: "1234test"
            };

            chai.request(server)
                .post("/v1/users/login")
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Auth failed");
                    done();
                });
        });
    });
    describe('GET /v1/users', () => {
        it('200 HAPPY PATH for users', (done) => {
            chai.request(server)
                .get("/v1/users")
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('GET /v1/users/:id', () => {
        it('200 HAPPY PATH for users by id', (done) => {
            chai.request(server)
                .get(`/v1/users/${id}`)
                .set('x-access-token', token)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
        it('should get 404 no entry for provided id', (done) => {
            chai.request(server)
                .get(`/v1/users/${fakeId}`)
                .set('x-access-token', token)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(404);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("No valid entry found for provided ID.");
                    done();
                });
        });
        it('should get 500 no entry for incorrect id', (done) => {
            chai.request(server)
                .get(`/v1/users/${id}1`)
                .set('x-access-token', token)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(500);
                    done();
                });
        });
    });
    describe('PATCH /v1/users/:id', () => {
        it('should get 200 updating user', (done) => {
            let updates = [
                {"propName": "card_information", "value": "12345"}
            ];

            chai.request(server)
                .patch(`/v1/users/${id}`)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("updatedUser");
                    res.body.updatedUser.card_information.should.equal("12345");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("User succesfully updated");
                    done();
                });
        });
        it('should get 500 for updating user with incorrect id', (done) => {
            let updates = [
                {"propName": "card_information", "value": "12345"}
            ];

            chai.request(server)
                .patch(`/v1/users/${id}1`)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(500);
                    done();
                });
        });
    });
});

