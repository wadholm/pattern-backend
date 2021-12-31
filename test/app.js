/* global it describe */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

chai.should();

chai.use(chaiHttp);

describe('app', () => {
    describe('GET /v1/', () => {
        it('200 HAPPY PATH for index', (done) => {
            chai.request(server)
                .get("/v1/")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });
});
