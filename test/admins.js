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
    mongoose.connection.collections.admins.drop(() => {
        done();
    });
});

describe('Admins model', () => {
    describe('POST /v1/admins/register', () => {
        it('should get 401 for missing username', (done) => {
            let admin = {
                password: "test"
            };

            chai.request(server)
                .post("/v1/admins/register")
                .send(admin)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(401);
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Username or password missing.");
                    done();
                });
        });
        it('should get 201 registering an admin', (done) => {
            let admin = {
                username: "admin1",
                password: "admin123"
            };

            chai.request(server)
                .post("/v1/admins/register")
                .send(admin)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("createdAdmin");
                    res.body.should.have.property("message");
                    id = res.body.createdAdmin._id;
                    res.body.message.should.equal("Succesfully created an admin");
                    done();
                });
        });
        it('should get 409 for admin already exists', (done) => {
            let admin = {
                username: "admin1",
                password: "admin123"
            };

            chai.request(server)
                .post("/v1/admins/register")
                .send(admin)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(409);
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Username already exists");
                    done();
                });
        });
    });
    describe('POST /v1/admins/login', () => {
        it('should get 200 loging in admin', (done) => {
            let admin = {
                username: "admin1",
                password: "admin123"
            };

            chai.request(server)
                .post("/v1/admins/login")
                .send(admin)
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
        it('should get 401 loging in non existing admin', (done) => {
            let admin = {
                username: "admin2",
                password: "admin123"
            };

            chai.request(server)
                .post("/v1/admins/login")
                .send(admin)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Auth failed");
                    done();
                });
        });
        it('should get 401 loging in admin with incorrect password', (done) => {
            let admin = {
                username: "admin1",
                password: "admin1234"
            };

            chai.request(server)
                .post("/v1/admins/login")
                .send(admin)
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
    describe('GET /v1/admins', () => {
        it('200 HAPPY PATH for admins', (done) => {
            chai.request(server)
                .get("/v1/admins")
                .set('x-access-token', token)
                .end((err, res) => {
                    if (err) {done(err);}
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
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
        it('should get 404 no entry for provided id', (done) => {
            chai.request(server)
                .get(`/v1/admins/${fakeId}`)
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
                .get(`/v1/admins/${id}1`)
                .set('x-access-token', token)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(500);
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
                .set('x-access-token', token)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Admin succesfully updated");
                    done();
                });
        });
        it('should get 500 for updating user with incorrect id', (done) => {
            let updates = [
                {"propName": "username", "value": "admin1"}
            ];

            chai.request(server)
                .patch(`/v1/users/${id}1`)
                .set('x-access-token', token)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(500);
                    done();
                });
        });
    });
});

