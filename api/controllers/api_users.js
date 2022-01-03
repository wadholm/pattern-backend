const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ApiUser = require("../models/api_user");

exports.api_register = (req, res) => {
    ApiUser.find({ email: req.body.email })
        .exec()
        .then(api => {
            if (!req.body.email) {
                res.render("api-result", {
                    api_key: "",
                    message: "Email missing.",
                    note: "Please try again."}
                );
            }
            if (api.length >= 1) {
                res.render("api-result", {
                    api_key: "",
                    message: "Email already exists!",
                    note: "Please try with another email adress."}
                );
            }

            let id = new mongoose.Types.ObjectId();

            const token = jwt.sign(
                {
                    email: req.body.email,
                    apiId: id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '35d'
                }
            );

            const newApiUser = new ApiUser({
                _id: id,
                email: req.body.email,
                api_key: token
            });

            newApiUser.save()
                .then(result => {
                    if (result) {
                        res.render("api-result", {
                            api_key: result.api_key,
                            message: "Registration succesfull!",
                            note: "This is your personal API key, keep it safe."}
                        );
                    }
                })
                // eslint-disable-next-line no-unused-vars
                .catch(err => {
                    // console.error(err);
                    res.render("api-result", {
                        api_key: "",
                        message: "Something went wrong!",
                        note: "Please try again."}
                    );
                });
        });
};

exports.api_deregister = (req, res) => {
    ApiUser.deleteOne({ email: req.body.email })
        .exec()
        .then(() => {
            res.render("api-result", {
                api_key: "",
                message: "Deregistration succesfull!",
                note: "Your email has been deleted."}
            );
        })
        .catch(err => {
            console.error(err);
            res.render("api-result", {
                api_key: "",
                message: "Something went wrong!",
                note: "Please try again."}
            );
        });
};

exports.api_register_form = (req, res) => {
    res.render("api-register");
};

exports.api_deregister_form = (req, res) => {
    res.render("api-deregister");
};
