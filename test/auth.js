/* global it describe */
/** global: server */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

chai.should();

chai.use(chaiHttp);

describe('Auth', () => {
    describe('POST /v1/auth', () => {
        it('should get 500 for required fields missing', (done) => {
            chai.request(server)
                .post("/v1/auth")
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(500);

                    done();
                });
        });
    });
});
