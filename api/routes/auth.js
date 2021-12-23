var express = require('express');
var router = express.Router();
const passport = require("passport");

const token = require("../../token");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000/";

// // Generate the Token for the user authenticated in the request
// function generateUserToken(req, res) {
//     console.log(req.user);
//     if (!req.user) {
//         return res.status(401).json({
//             message: "Auth failed"
//         });
//     }
//     const accessToken = token.generateAccessToken(req.user.id);

//     res.set('x-token', accessToken);
//     res.redirect(CLIENT_HOME_PAGE_URL);
//     // return res.status(200).json({
//     //     message: "Auth succesful",
//     //     token: accessToken
//     // });
// }

// auth login
router.get("/login", (req, res) => {
    res.render("login");
});

// update generate Acces token to use email aswell?
// auth login success
router.get("/login/success", (req, res) => {
    if (req.user) {
        const accessToken = token.generateAccessToken(req.user._id);

        return res.status(200).json({
            message: "Auth succesful",
            token: accessToken,
            user: req.user
        });
    }
    return res.status(200).json({
        message: "Auth failed",
    });
});

// auth login failed
router.get("/login/failed", (req, res) => {
    return res.status(401).json({
        message: "Auth failed"
    });
    //redirect to home page?
});

// auth logout
router.get("/logout", (req, res) => {
    req.logout();
    return res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with google
router.get("/google", passport.authenticate("google", {
    // session: false,
    scope: ["openid profile email"]
}));

//callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google", {
    // session: false,
    successRedirect: CLIENT_HOME_PAGE_URL,
    // failureRedirect: "/login/failed",
    failureRedirect: "/auth/login/failed"
})
);

// //callback route for google to redirect to
// router.get("/google/redirect", passport.authenticate("google", {
//     session: false }), generateUserToken
// );


// // auth with github
// router.get("/github", passport.authenticate("github", {
//     session: false, scope: ["user:email"]
// }));

// //callback route for github to redirect to
// router.get("/github/redirect", passport.authenticate("github", {
//     session: false }), generateUserToken);

// // auth with facebook
// router.get("/facebook", passport.authenticate("facebook", {
//     session: false
// }));

// //callback route for facebook to redirect to
// router.get("/facebook/redirect", passport.authenticate("facebook", {
//     session: false }), generateUserToken);

module.exports = router;
