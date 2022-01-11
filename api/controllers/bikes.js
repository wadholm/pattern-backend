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
        })
        .catch(err => {
            // console.error(err);
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
            return res.status(404).json({
                message: "No valid entry found for provided ID."
            });
        })
        .catch(err => {
            // console.error(err);
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


function chargeBike(id) {
    let updateDoc = { bike_status: "available", battery_status: 100};

    Bike.findById(id)
        .select("-__v")
        .exec()
        .then(doc => {
            if (doc.maintenance) {
                updateDoc.bike_status = "unavailable";
            }
            Bike.updateOne({ _id: id }, { $set: updateDoc })
                .exec()
                .then(() => {
                    console.info("Bike fully charged");
                })
                .catch(err => {
                    console.error(err);
                });
        })
        .catch(err => {
            console.error(err);
        });
}

exports.bikes_update_bike = (req, res) => {
    const id = req.params.bikeId;
    const updateOps = {};

    Bike.findById(id)
        .select("-__v")
        .exec()
        .then(doc => {
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
                if (
                    ops.propName === "charge_id" &&
                    ops.value &&
                    doc.battery_status < process.env.BATTERY_LIMIT
                ) {
                    //charge battery
                    updateOps["bike_status"] = "unavailable";
                    // setTimout
                    setTimeout(function() {
                        chargeBike(id);
                    }, 60000);
                    // testing with 60 000 miliseconds = 1 minute,for prod 10 minutes
                }
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
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.bikes_maintenance = (req, res) => {
    const id = req.params.bikeId;
    const maintenance = req.body.maintenance;
    let updateDoc;

    let changes = {
        bike_status: "available",
        battery_status: 100,
        maintenance: false
    };

    if (maintenance) {
        changes = {
            bike_status: "unavailable",
            charge_id: req.body.charge_id,
            maintenance: true
        };
    }

    updateDoc = {
        $set: changes
    };

    Bike.updateOne({ _id: id }, updateDoc)
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Maintenance succesfully updated"
            });
        })
        .catch(err => {
            // console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

// exports.bikes_unset_maintanance = (req, res) => {
//     const id = req.params.bikeId;

//     Bike.updateOne({ _id: id },
//         { $set: { bike_status: "available", battery_status: 100, maintanance: false } })
//         .exec()
//         .then(() => {
//             res.status(200).json({
//                 message: "Bike succesfully set for maintanance"
//             });
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };


// exports.bikes_delete_bike = (req, res) => {
//     const id = req.params.bikeId;

//     Bike.remove({ _id: id })
//         .exec()
//         .then(() => {
//             res.status(200).json({
//                 message: "Bike succesfully deleted"
//             });
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };

