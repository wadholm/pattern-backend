const mongoose = require("mongoose");

const Trip = require("../models/trip");

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

exports.trips_end_trip = (req, res) => {
    const id = req.params.tripId;

    Trip.updateOne({ _id: id },
        { $set: {
            stop_time: new Date,
            stop_coordinates: req.body.stop_coordinates, // get from bikes
            average_speed: req.body.average_speed, // ta bort
            distance: req.body.distance, // bike solves
            price: req.body.price // use prices i database
        }})
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Trip ended"
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
