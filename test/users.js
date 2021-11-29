/* global it describe */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

chai.should();

chai.use(chaiHttp);

describe('Users model', () => {
    describe('GET /users', () => {
        it('401 no token for users', (done) => {
            chai.request(server)
                .get("/users")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
});
