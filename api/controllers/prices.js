const mongoose = require("mongoose");

const Price = require("../models/price");

exports.prices_get = (req, res) => {
    Price.find()
        .select("-__v")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                prices: docs
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

exports.prices_add = (req, res) => {
    const price = new Price({
        _id: new mongoose.Types.ObjectId(),
        starting_fee: req.body.starting_fee,
        price_per_minute: req.body.price_per_minute,
        penalty_fee: req.body.penalty_fee,
        discount: req.body.discount
    });

    price.save()
        .then(result => {
            res.status(201).json({
                message: "Succesfully added price",
                addedPrice: {
                    _id: result._id,
                    starting_fee: result.starting_fee,
                    price_per_minute: result.price_per_minute,
                    penalty_fee: result.penalty_fee,
                    discount: result.discount
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.prices_update = (req, res) => {
    const id = req.params.priceId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Price.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "price succesfully updated"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.prices_delete = (req, res) => {
    const id = req.params.priceId;

    Price.remove({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "price succesfully deleted"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};
