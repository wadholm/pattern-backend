const mongoose = require("mongoose");

const Bike = require("../models/bike");

exports.bikes_get_all = (req, res) => {
    Bike.find()
        .select("-__v")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                bikes: docs
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

exports.bikes_get_by_city = (req, res) => {
    const id = req.params.cityId;

    Bike.find({ city_id: id })
        .select("-__v")
        .exec()
        .then(docs => {
            if (docs) {
                const response = {
                    count: docs.length,
                    bikes: docs
                };

                return res.status(200).json(response);
            }
            res.status(404).json({
                message: "No valid entries found for provided city."
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.bikes_get_bike = (req, res) => {
    const id = req.params.bikeId;

    Bike.findById(id)
        .select("-__v")
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    bike: doc
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

exports.bikes_add_bike = (req, res) => {
    const bike = new Bike({
        _id: new mongoose.Types.ObjectId(),
        city_id: req.body.city_id,
        charge_id: req.body.charge_id,
        parking_id: req.body.parking_id,
        bike_status: req.body.bike_status,
        battery_status: req.body.battery_status,
        maintanance: req.body.maintanance,
        coordinates: {
            lat: req.body.lat,
            long: req.body.long
        }
    });

    bike.save()
        .then(result => {
            res.status(201).json({
                message: "Succesfully added a bike",
                addedBike: result
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.bikes_update_bike = (req, res) => {
    const id = req.params.bikeId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Bike.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Bike succesfully updated"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.bikes_set_maintanance = (req, res) => {
    const id = req.params.bikeId;

    Bike.updateOne({ _id: id }, { $set: { maintanance: new Date} })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Timestamp set for maintanance"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.bikes_delete_bike = (req, res) => {
    const id = req.params.bikeId;

    Bike.remove({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Bike succesfully deleted"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

