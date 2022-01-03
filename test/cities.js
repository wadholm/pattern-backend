/* eslint-env mocha */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

const mongoose = require('mongoose');

chai.should();

chai.use(chaiHttp);

let cityId;
let stationId;
let latNW = 59.405848;
let longNW = 13.502490;
let latSE = 59.387455;
let longSE = 13.535529;

before((done) => {
    mongoose.connection.collections.cities.drop(() => {
        done();
    });
});

describe('Cities model', () => {
    describe('GET /v1/cities', () => {
        it('200 HAPPY PATH for cities', (done) => {
            chai.request(server)
                .get("/v1/cities")
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('POST /v1/cities', () => {
        it('201 HAPPY PATH for adding a city', (done) => {
            let city = {
                name: "Central City",
                coordinates: {
                    northwest: {
                        lat: latNW,
                        long: longNW
                    },
                    southeast: {
                        lat: latSE,
                        long: longSE
                    }
                }
            };

            chai.request(server)
                .post(`/v1/cities`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(city)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("addedCity");
                    res.body.should.have.property("message");
                    cityId = res.body.addedCity._id;
                    res.body.message.should.equal("Succesfully added a city");
                    done();
                });
        });
    });
    describe('GET /v1/cities/:cityId', () => {
        it('200 HAPPY PATH for city by cityId', (done) => {
            chai.request(server)
                .get(`/v1/cities/${cityId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('GET /v1/cities/stations/:cityId', () => {
        it('200 HAPPY PATH for stations by cityId', (done) => {
            chai.request(server)
                .get(`/v1/cities/stations/${cityId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('POST /v1/:cityId', () => {
        it('201 HAPPY PATH for adding a station', (done) => {
            let station = {
                station_type: "charge_stations",
                name: "Example station"
            };

            chai.request(server)
                .post(`/v1/cities/${cityId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(station)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("updatedStations");
                    res.body.should.have.property("message");
                    stationId = res.body.updatedStations[0]._id;
                    res.body.message.should.equal("Succesfully added a station");
                    done();
                });
        });
    });
    describe('GET /v1/cities/station/:stationId', () => {
        it('200 HAPPY PATH for station by stationId', (done) => {
            let data = {
                city_id: cityId,
                station_type: "charge_stations"
            };

            chai.request(server)
                .get(`/v1/cities/station/${stationId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('PATCH /v1/cities/:cityId', () => {
        it('should get 200 updating city', (done) => {
            let updates = [
                {"propName": "charge_id", "value": stationId}
            ];

            chai.request(server)
                .patch(`/v1/cities/${cityId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(updates)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("City succesfully updated");
                    done();
                });
        });
    });
    describe('PATCH /v1/cities/station/:stationId', () => {
        it('should get 200 updating station', (done) => {
            let data = {
                city_id: cityId,
                station_type: "charge_stations",
                coordinates: {
                    northwest: {
                        lat: latNW,
                        long: longNW
                    },
                    southeast: {
                        lat: latSE,
                        long: longSE
                    }
                }
            };

            chai.request(server)
                .patch(`/v1/cities/station/${stationId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Station succesfully updated");
                    done();
                });
        });
    });
});
