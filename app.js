const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

require('dotenv').config();

require("./auth/google");
require("./auth/github");
require("./auth/facebook");

const app = express();

//Routes
const index = require('./api/routes/index');
const api = require('./api/routes/api_users');
const users = require('./api/routes/users');
const admins = require('./api/routes/admins');
const cities = require('./api/routes/cities');
const prices = require('./api/routes/prices');
const bikes = require('./api/routes/bikes');
const trips = require('./api/routes/trips');
const auth = require('./api/routes/auth');

const port = 1337;

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined'));
}

app.use(express.json());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(
    cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Cors
app.use(cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
}));

// Middleware for all routes
app.use((req, res, next) => {
    next();
});

// Add routes
app.use('/', index);
app.use('/api', api);
app.use('/users', users);
app.use('/admins', admins);
app.use('/cities', cities);
app.use('/prices', prices);
app.use('/bikes', bikes);
app.use('/trips', trips);
app.use('/auth', auth);

// set view engine for testing Oauth / manual for API?
app.set('view engine', 'ejs');

// Connect Mongoose
let dsn;

// Test db
if (process.env.NODE_ENV === 'test') {
    dsn = "mongodb://localhost:27017/testdb";
} else {
    // MongoDB Atlas
    dsn = `
    mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}` +
    `@${process.env.DB_CLUSTER}.jr7l8.mongodb.net/${process.env.DB_NAME}` +
    `?retryWrites=true&w=majority`;
}

mongoose.connect(
    dsn,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
// Start up server
    .then(() => {
        app.listen(port, () => {
            console.log(`Pattern API with Mongoose listening on port ${port}!`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

// Routes for 404 and error handling
app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});


exports.app = app;
