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
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});

describe('Users model', () => {
    describe('POST /v1/users/register', () => {
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
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("createdUser");
                    res.body.should.have.property("message");
                    id = res.body.createdUser._id;
                    res.body.message.should.equal("Succesfully created a user");
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
    describe('GET /v1/users', () => {
        it('200 HAPPY PATH for users', (done) => {
            chai.request(server)
                .get("/v1/users")
                .end((err, res) => {
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
                    res.should.have.status(200);
                    res.body.should.be.an("object");
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
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("updatedUser");
                    res.body.updatedUser.card_information.should.equal("12345");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("User succesfully updated");
                    done();
                });
        });
    });
});

