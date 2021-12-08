const mongoose = require("mongoose");

const { City } = require("../models/city");

exports.cities_get_all = (req, res) => {
    City.find()
        .select("-__v")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                cities: docs
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

exports.cities_get_city = (req, res) => {
    const id = req.params.cityId;

    City.findById(id)
        .select("-__v")
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    city: doc
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

exports.cities_get_stations = (req, res) => {
    const id = req.params.cityId;

    let select;

    switch (req.body.station_type) {
        case "charge_stations":
            select = "charge_stations -_id";
            break;
        case "parking_stations":
            select = "parking_stations -_id";
            break;
        default:
            select = "parking_stations charge_stations -_id";
    }

    City.findById(id)
        .select(select)
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    stations: doc
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

exports.cities_get_station = (req, res) => {
    const id = req.params.stationId;
    const cityId = req.body.city_id;
    const station = req.body.station_type;

    City.findById(cityId)
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    station: doc[station].id(id)
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

exports.cities_add_city = (req, res) => {
    const city = new City({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        coordinates: req.body.coordinates,
        charge_stations: req.body.charge_stations,
        parking_stations: req.body.parking_stations
    });

    city.save()
        .then(result => {
            res.status(201).json({
                message: "Succesfully added a city",
                addedCity: result
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.cities_update_city = (req, res) => {
    const id = req.params.cityId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    City.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "City succesfully updated"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.cities_add_station = (req, res) => {
    const id = req.params.cityId;
    const station = req.body.station_type;

    City.findById(id)
        .select("-__v")
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).json({
                    message: "No valid entry found for provided ID."
                });
            }
            doc[station].push({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                coordinates: req.body.coordinates
            });
            doc.save()
                .then(result => {
                    return res.status(201).json({
                        message: "Succesfully added a station",
                        updatedStations: result[station]
                    });
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({
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

exports.cities_update_station = async (req, res) => {
    const stationId = req.params.stationId;
    const cityId = req.body.city_id;
    const station = req.body.station_type;

    City.findById(cityId)
        .then((doc) => {
            const currentStation = doc[station].id(stationId);

            currentStation.coordinates = req.body.coordinates;

            return doc.save();
        })
        .then(() => {
            res.status(200).json({
                message: "Station succesfully updated"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.cities_delete_city = (req, res) => {
    const id = req.params.cityId;

    City.remove({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "City succesfully deleted"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

