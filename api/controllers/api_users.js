const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ApiUser = require("../models/api_user");

exports.api_register = (req, res) => {
    ApiUser.find({ email: req.body.email })
        .exec()
        .then(api => {
            if (api.length >= 1) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            let id = new mongoose.Types.ObjectId();

            const token = jwt.sign(
                {
                    email: req.body.email,
                    apiId: id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h'
                }
            );

            const newApiUser = new ApiUser({
                _id: id,
                email: req.body.email,
                api_key: token
            });

            newApiUser.save()
                .then(result => {
                    res.status(201).json({
                        message: "Succesfully created an api key",
                        createdApi: {
                            _id: result._id,
                            email: result.email,
                            api_key: result.api_key
                        }
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({
                        error: err
                    });
                });
        });
};
