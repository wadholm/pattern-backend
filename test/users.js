/* global it describe */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

chai.should();

chai.use(chaiHttp);

describe('Users model', () => {
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
});
