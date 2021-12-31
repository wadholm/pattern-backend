const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require('dotenv').config();

const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

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

// Cors
app.use(cors({
    origin: CLIENT_HOME_PAGE_URL, // allow server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
}));

// Middleware for all routes
app.use((req, res, next) => {
    next();
});

// Add routes
// current version v1
app.use('/v1/', index);
app.use('/v1/api', api);
app.use('/v1/users', users);
app.use('/v1/admins', admins);
app.use('/v1/cities', cities);
app.use('/v1/prices', prices);
app.use('/v1/bikes', bikes);
app.use('/v1/trips', trips);
app.use('/v1/auth', auth);

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
