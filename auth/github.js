// const passport = require("passport");
// const GithubStrategy = require("passport-github2");
// // const mongoose = require("mongoose");
// // const User = require("../api/models/user");

// require('dotenv').config();

// passport.use(
//     new GithubStrategy({
//         //options for the github strategy
//         callbackURL: "/auth/github/redirect",
//         clientID: process.env.GITHUB_CLIENT_ID,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET,
//         scope: [ 'user:email' ], // fetches non-public emails as well
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
