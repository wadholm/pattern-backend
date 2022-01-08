/* eslint-env mocha */
/** global: server */


// process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

const mongoose = require('mongoose');

chai.should();

chai.use(chaiHttp);

let cityId;
let bikeId;
let stationId;
let fakeId = "61d365ca2225d44c561be6bd";
let latNW = 59.405848;
let longNW = 13.502490;
let latSE = 59.387455;
let longSE = 13.535529;

before((done) => {
    const { cities, bikes } = mongoose.connection.collections;

    cities.drop(() => {
        bikes.drop(() => {
            done();
        });
    });
});

describe('Bikes model', () => {
    describe('GET /v1/bikes', () => {
        it('200 HAPPY PATH for bikes', (done) => {
            chai.request(server)
                .get("/v1/bikes")
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('POST /v1/bikes', () => {
        beforeEach((done) => {
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
                .post("/v1/cities")
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(city)
                .end((err, res) => {
                    if (err) {done(err);}
                    cityId = res.body.addedCity._id;
                    res.should.have.status(201);
                    done();
                });
        });
        it('201 HAPPY PATH for adding bike', (done) => {
            let bike = {
                city_id: cityId,
                lat: latNW,
                long: longNW,
                battery_status: process.env.LOW_BATTERY
            };

            chai.request(server)
                .post(`/v1/bikes`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(bike)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("addedBike");
                    res.body.should.have.property("message");
                    bikeId = res.body.addedBike._id;
                    res.body.message.should.equal("Succesfully added a bike");
                    done();
                });
        });
    });
    describe('GET /v1/bikes/city/:cityId', () => {
        it('200 HAPPY PATH for bikes by city', (done) => {
            chai.request(server)
                .get(`/v1/bikes/city/${cityId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
        it('should get 500 for incorrect id', (done) => {
            chai.request(server)
                .get(`/v1/bikes/city/${cityId}1`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('GET /v1/bikes/:bikeId', () => {
        it('200 HAPPY PATH for bike by id', (done) => {
            chai.request(server)
                .get(`/v1/bikes/${bikeId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("bike");
                    done();
                });
        });
        it('should get 404 no entry for provided id', (done) => {
            chai.request(server)
                .get(`/v1/bikes/${fakeId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(404);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("No valid entry found for provided ID.");
                    done();
                });
        });
    });
    describe('PUT /v1/bikes/maintenance/:bikeId', () => {
        beforeEach((done) => {
            let station = {
                station_type: "charge_stations",
                name: "Example station"
            };

            chai.request(server)
                .post(`/v1/cities/${cityId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(station)
                .end((err, res) => {
                    if (err) {done(err);}
                    stationId = res.body.updatedStations[0]._id;
                    res.should.have.status(201);
                    done();
                });
        });
        it('should get 200 setting bike to maintenance', (done) => {
            let updates = {
                "maintenance": true,
                "charge_id": stationId
            };

            chai.request(server)
                .put(`/v1/bikes/maintenance/${bikeId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Maintenance succesfully updated");
                    done();
                });
        });
        // it('should get 200 unsetting bike maintenance', (done) => {
        //     let updates = {
        //         "maintenance": false
        //     };

        //     chai.request(server)
        //         .put(`/v1/bikes/maintenance/${bikeId}`)
        //         .set('x-access-token', process.env.TEST_TOKEN)
        //         .send(updates)
        //         .end((err, res) => {
        //             if (err) {done(err);}
        //             res.should.have.status(200);
        //             res.body.should.be.an("object");
        //             res.body.should.have.property("message");
        //             res.body.message.should.equal("Maintenance succesfully updated");
        //             done();
        //         });
        // });
        it('should get 500 for incorrect id', (done) => {
            let updates = {
                "maintenance": false
            };

            chai.request(server)
                .put(`/v1/bikes/maintenance/${bikeId}1`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(500);
                    done();
                });
        });
    });
    describe('PATCH /v1/bikes/:id', () => {
        it('should get 200 updating bike', (done) => {
            let updates = [
                {"propName": "battery_status", "value": 15}
            ];

            chai.request(server)
                .patch(`/v1/bikes/${bikeId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Bike succesfully updated");
                    done();
                });
        });
        it('should get 200 updating bike charging', (done) => {
            let updates = [
                {"propName": "charge_id", "value": stationId}
            ];

            chai.request(server)
                .patch(`/v1/bikes/${bikeId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Bike succesfully updated");
                    done();
                });
        });
        it('should get 404 for incorrect id', (done) => {
            let updates = {
                "maintenance": false
            };

            chai.request(server)
                .put(`/v1/bikes/${bikeId}1`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
