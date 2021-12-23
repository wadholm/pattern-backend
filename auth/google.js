const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const mongoose = require("mongoose");
const User = require("../api/models/user");

require('dotenv').config();

passport.use(
    new GoogleStrategy({
        //options for the google strategy
        callbackURL: "/auth/google/redirect",
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }, (accessToken, refreshToken, profile, done) => {
        // check if user exists in db
        User.findOne({ email: profile._json.email })
            .then((currentUser, err) => {
                if (err) { return done(err); }
                if (!currentUser) {
                    new User({
                        _id: new mongoose.Types.ObjectId(),
                        firstname: profile._json.given_name,
                        lastname: profile._json.family_name,
                        email: profile._json.email
                    }).save().then((newUser) => {
                        console.info("new user created: " + newUser);
                        return done(null, newUser);
                    });
                }
                return done(null, currentUser);
            });
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
