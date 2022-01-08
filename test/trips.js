/* eslint-env mocha */
/** global: server */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require("../app.js");

const mongoose = require('mongoose');

chai.should();

chai.use(chaiHttp);

let cityId;
let bikeId;
let userId;
let tripId;
let fakeTripId = "61d37e42dc79ead6cfe2bb1f";
let latNW = 59.405848;
let longNW = 13.502490;
let latSE = 59.387455;
let longSE = 13.535529;

before((done) => {
    const { cities, users, bikes, trips } = mongoose.connection.collections;

    cities.drop(() => {
        users.drop(() => {
            bikes.drop(() => {
                trips.drop(() => {
                    done();
                });
            });
        });
    });
});

describe('Trips model', () => {
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
    describe('GET /v1/trips', () => {
        beforeEach((done) => {
            let user = {
                firstname: "Jane",
                lastname: "Doe",
                email: "example@example.com",
                password: "123test"
            };

            chai.request(server)
                .post("/v1/users/register")
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(user)
                .end((err, res) => {
                    if (err) {done(err);}
                    userId = res.body.createdUser._id;
                    res.should.have.status(201);
                    done();
                });
        });
        it('200 HAPPY PATH for trips', (done) => {
            chai.request(server)
                .get("/v1/trips")
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('POST /v1/trips', () => {
        beforeEach((done) => {
            let bike = {
                city_id: cityId,
                lat: latNW,
                long: longNW,
                battery_status: 15,
                coordinates: {
                    lat: latNW,
                    long: longNW
                }
            };

            chai.request(server)
                .post("/v1/bikes")
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(bike)
                .end((err, res) => {
                    if (err) {done(err);}
                    bikeId = res.body.addedBike._id;
                    res.should.have.status(201);
                    done();
                });
        });
        it('should get 404 for required fields missing', (done) => {
            chai.request(server)
                .post(`/v1/trips`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(404);
                    res.body.should.have.property("message");
                    res.body.message.should.equal("No valid entry found for provided bike ID.");
                    done();
                });
        });
        it('201 HAPPY PATH for starting trip', (done) => {
            let trip = {
                user_id: userId,
                bike_id: bikeId,
                start_coordinates: {
                    lat: latNW,
                    long: longNW,
                },
            };

            chai.request(server)
                .post(`/v1/trips`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(trip)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("startedTrip");
                    res.body.should.have.property("message");
                    tripId = res.body.startedTrip._id;
                    res.body.message.should.equal("Succesfully started trip");
                    done();
                });
        });
    });
    describe('GET /v1/trips/:tripId', () => {
        it('200 HAPPY PATH for trips by id', (done) => {
            chai.request(server)
                .get(`/v1/trips/${tripId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("trip");
                    console.log(tripId);
                    done();
                });
        });
        it('should get 404 no entry for provided id', (done) => {
            chai.request(server)
                .get(`/v1/trips/${fakeTripId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(404);
                    res.body.should.be.an("object");
                    done();
                });
        });
        it('should get 500 for incorrect id', (done) => {
            chai.request(server)
                .get(`/v1/trips/${tripId}1`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('GET /v1/trips/user/:userId', () => {
        it('200 HAPPY PATH for trips by user id', (done) => {
            chai.request(server)
                .get(`/v1/trips/user/${userId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("trips");
                    console.log(userId);
                    done();
                });
        });
        it('should get 500 for incorrect id', (done) => {
            chai.request(server)
                .get(`/v1/trips/user/${userId}1`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
    describe('PATCH /v1/trips/:tripId', () => {
        it('should get 200 updating trip', (done) => {
            let updates = [
                {"propName": "coordinates", "value": {
                    "lat": latSE,
                    "long": longSE
                }
                }
            ];

            chai.request(server)
                .patch(`/v1/trips/${tripId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Trip succesfully updated");
                    done();
                });
        });
    });
    describe('PATCH /v1/trips/end/:tripId', () => {
        beforeEach((done) => {
            let updates = [
                {"propName": "latest_trip",
                    "value":
                {"average_speed": 25,
                    "distance": 180, "price": 35
                }}
            ];

            chai.request(server)
                .patch(`/v1/bikes/${bikeId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .send(updates)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    done();
                });
        });
        it('should get 200 ending trip', (done) => {
            chai.request(server)
                .patch(`/v1/trips/end/${tripId}`)
                .set('x-access-token', process.env.TEST_TOKEN)
                .end((err, res) => {
                    if (err) {done(err);}
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Trip ended");
                    done();
                });
        });
    });
});
