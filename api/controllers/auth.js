const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/user");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.auth = async (req, res) => {
    const { tokenId } = req.body;
    let email;
    let userId;
    let firstname;
    let lastname;

    try {
        const response = await client.verifyIdToken({
            idToken: tokenId,
            requiredAudience: process.env.GOOGLE_CLIENT_ID,
        });

        firstname = response.payload.given_name;
        lastname = response.payload.family_name;
        email = response.payload.email;
    } catch (err) {
        return res.status(500).json({
            error: err,
        });
    }

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });

        if (existingUser) {
            userId = existingUser._id;
        }
    } catch (err) {
        return res.status(500).json({
            error: err,
        });
    }

    if (!existingUser) {
        const createdUser = new User({
            _id: new mongoose.Types.ObjectId(),
            firstname,
            lastname,
            email
        });

        try {
            await createdUser.save();
            userId = createdUser._id;
        } catch (err) {
            return res.status(500).json({
                error: err,
            });
        }
    }

    let token;

    try {
        token = jwt.sign(
            {
                email: email,
                userId: userId,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );
    } catch (err) {
        return res.status(500).json({
            error: err,
        });
    }
    // console.log("token: " + token);
    res.status(201).json({
        userId,
        userEmail: email,
        token: token,
        expiresIn: 3600 * 24,
    });
};
