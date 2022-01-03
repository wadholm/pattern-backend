const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Admin = require("../models/admin");

exports.admins_get_all = (req, res) => {
    Admin.find()
        .select("-__v")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                admins: docs
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

exports.admins_get_admin = (req, res) => {
    const id = req.params.adminId;

    Admin.findById(id)
        .select("-__v")
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    admin: doc
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

exports.admins_register = (req, res) => {
    Admin.find({ username: req.body.username })
        .exec()
        .then(admin => {
            if (admin.length >= 1) {
                return res.status(409).json({
                    message: "Username already exists"
                });
            }
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                const admin = new Admin({
                    _id: new mongoose.Types.ObjectId(),
                    username: req.body.username,
                    password: hash
                });

                admin.save()
                    .then(result => {
                        res.status(201).json({
                            message: "Succesfully created an admin",
                            createdAdmin: {
                                _id: result._id,
                                username: result.username,
                                password: result.password
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

exports.admins_login = (req, res) => {
    Admin.find({ username: req.body.username })
        .exec()
        .then(admin => {
            if (admin.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            username: admin[0].username,
                            adminId: admin[0]._id
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

exports.admins_update_admin = (req, res) => {
    const id = req.params.adminId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Admin.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Admin succesfully updated"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
};

// exports.admins_delete_admin = (req, res) => {
//     const id = req.params.adminId;

//     Admin.remove({ _id: id })
//         .exec()
//         .then(() => {
//             res.status(200).json({
//                 message: "admin succesfully deleted"
//             });
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };
