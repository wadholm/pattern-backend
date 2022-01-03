const mongoose = require("mongoose");

const Trip = require("../models/trip");
const Bike = require("../models/bike");

exports.trips_get_all = (req, res) => {
    Trip.find()
        .select("-__v")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                trips: docs
            };

            res.status(200).json(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.trips_get_by_user = (req, res) => {
    const id = req.params.userId;

    Trip.find({ user_id: id })
        .select("-__v")
        .exec()
        .then(docs => {
            if (docs) {
                const response = {
                    count: docs.length,
                    trips: docs
                };

                return res.status(200).json(response);
            }
            res.status(404).json({
                message: "No valid entries found for provided user."
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.trips_get_trip = (req, res) => {
    const id = req.params.tripId;

    Trip.findById(id)
        .select("-__v")
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    trip: doc
                });
            }
            res.status(404).json({
                message: "No valid entry found for provided ID."
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.trips_start_trip = (req, res) => {
    const trip = new Trip({
        _id: new mongoose.Types.ObjectId(),
        user_id: req.body.user_id,
        bike_id: req.body.bike_id,
        start_time: new Date,
        start_coordinates: req.body.start_coordinates // get coordinates from bike position
    });

    trip.save()
        .then(result => {
            res.status(201).json({
                message: "Succesfully started trip",
                startedTrip: result
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.trips_update_trip = (req, res) => {
    const id = req.params.tripId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Trip.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Trip succesfully updated"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

// exports.trips_end_trip = (req, res) => {
//     const id = req.params.tripId;
//     let currentBike = {
//         stop_coordinates: "", // get from bikes
//         average_speed: "", // get from bikes
//         distance: "", // get from bikes
//         price: "" // get from bikes
//     };

//     Trip.findById(id)
//         .select("-__v")
//         .exec()
//         .then(doc => {
//             if (doc) {
//                 console.log(doc.bike_id.toJSON());
//                 const bikeId = doc.bike_id.toJSON();

//                 Bike.findById(bikeId)
//                     .select("-__v")
//                     .exec()
//                     .then(doc => {
//                         if (doc) {
//                             // console.log(doc.latest_trip.price);
//                             // console.log(doc);
//                             currentBike = {
//                                 stop_coordinates: doc.coordinates,
//                                 average_speed: doc.latest_trip.average_speed,
//                                 distance: doc.latest_trip.distance,
//                                 price: doc.latest_trip.price
//                             };
//                             console.log(currentBike);
//                             Trip.updateOne({ _id: id },
//                                 { $set: {
//                                     stop_time: new Date().toJSON(),
// eslint-disable-next-line max-len
//                                     stop_coordinates: currentBike.stop_coordinates, // get from bike
//                                     average_speed: currentBike.average_speed, // get from bikes
//                                     distance: currentBike.distance, // get from bikes
//                                     price: currentBike.price // get from bikes
//                                 }})
//                                 .exec()
//                                 .then(() => {
//                                     console.log("1 Trip ended");
//                                     // return res.status(200).json({
//                                     //     message: "Trip ended"
//                                     // });
//                                 })
//                                 .catch(err => {
//                                     console.error(err);
//                                     res.status(500).json({
//                                         error: err
//                                     });
//                                 });
//                         }
//                         console.error("2 No valid entry found for provided bike ID.");
//                         // return res.status(404).json({
//                         //     message: "No valid entry found for provided bike ID."
//                         // });
//                     })
//                     .catch(err => {
//                         console.error(err);
//                         res.status(500).json({
//                             error: err
//                         });
//                     });
//             }
//             console.error("3 No valid entry found for provided bike ID.");
//             return res.status(404).json({
//                 message: "No valid entry found for provided trip ID."
//             });
//         })
//     // get data from bike -> latest_trip
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };

exports.trips_end_trip = (req, res) => {
    const id = req.params.tripId;
    let bikeId;
    let currentBike = {
        stop_coordinates: "", // get from bikes
        average_speed: "", // get from bikes
        distance: "", // get from bikes
        price: "" // get from bikes
    };

    Trip.findById(id)
        .select("-__v")
        .exec()
        .then(trip => {
            if (!trip) {
                return res.status(404).json({
                    message: "No valid entry found for provided trip ID."
                });
            }
            bikeId = trip.bike_id.toJSON();
            Bike.findById(bikeId)
                .select("-__v")
                .exec()
                .then(bike => {
                    if (!bike) {
                        return res.status(404).json({
                            message: "No valid entry found for provided bike ID."
                        });
                    }
                    currentBike = {
                        stop_coordinates: bike.coordinates,
                        average_speed: bike.latest_trip.average_speed,
                        distance: bike.latest_trip.distance,
                        price: bike.latest_trip.price
                    };
                    Trip.updateOne({ _id: id },
                        { $set: {
                            stop_time: new Date().toJSON(),
                            stop_coordinates: currentBike.stop_coordinates, // get from bike
                            average_speed: currentBike.average_speed, // get from bikes
                            distance: currentBike.distance, // get from bikes
                            price: currentBike.price // get from bikes
                        }})
                        .exec()
                        .then(() => {
                            return res.status(200).json({
                                message: "Trip ended"
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.trips_delete_trip = (req, res) => {
    const id = req.params.tripId;

    Trip.remove({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Trip succesfully deleted"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};
