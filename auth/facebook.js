// const passport = require("passport");
// const FacebookStrategy = require("passport-facebook");
// // const mongoose = require("mongoose");
// // const User = require("../api/models/user");

// require('dotenv').config();

// passport.use(
//     new FacebookStrategy({
//         //options for the facebook strategy
//         callbackURL: "/auth/facebook/redirect",
//         clientID: process.env.FACEBOOK_CLIENT_ID,
//         clientSecret: process.env.FACEBOOK_CLIENT_SECRET
//     }, (accessToken, refreshToken, profile, done) => {
//         // check if user exists in db
//         console.log(profile);
//         // User.findOne({ email: profile._json.email }).then((currentUser) => {
//         //     if (!currentUser) {
//         //         new User({
//         //             _id: new mongoose.Types.ObjectId(),
//         //             firstname: profile._json.given_name,
//         //             lastname: profile._json.family_name,
//         //             email: profile._json.email
//         //         }).save().then((newUser) => {
//         //             console.log("new user created: " + newUser);
//         //             return done(null, newUser);
//         //         });
//         //     }
//         //     return done(null, currentUser);
//         // });
//     })
// );
