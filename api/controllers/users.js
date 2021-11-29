const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.users_get_all = (req, res) => {
    User.find()
        .select("-__v")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs
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

exports.users_get_user = (req, res) => {
    const id = req.params.userId;

    User.findById(id)
        .select("-__v")
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    user: doc
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

exports.users_register = (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    firstname: req.body.firstName,
                    lastname: req.body.lastName,
                    email: req.body.email,
                    password: hash,
                    phone: req.body.phone,
                    payment_method: req.body.payment_method,
                    card_information: req.body.card_information,
                    balance: req.body.balance,
                    account_status: req.body.account_status
                });

                user.save()
                    .then(result => {
                        res.status(201).json({
                            message: "Succesfully created a user",
                            createdUser: {
                                _id: result._id,
                                firstname: result.firstname,
                                lastname: result.lastname,
                                email: result.email,
                                password: result.password,
                                phone: result.phone,
                                payment_method: result.payment_method,
                                card_information: result.card_information,
                                balance: result.balance,
                                account_status: result.account_status
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
        });
};

exports.users_login = (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '24h'
                        }
                    );

                    return res.status(200).json({
                        message: "Auth succesful",
                        token: token
                    });
                }
                return res.status(401).json({
                    message: "Auth failed"
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

exports.users_update_user = (req, res) => {
    const id = req.params.userId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    User.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "User succesfully updated"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.users_delete_user = (req, res) => {
    const id = req.params.userId;

    User.remove({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "User succesfully deleted"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};
