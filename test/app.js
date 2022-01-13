/* global it describe */
/** global: server */

// process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

chai.should();

chai.use(chaiHttp);

describe('Index', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH for index', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);

                    done();
                });
        });
    });
});
