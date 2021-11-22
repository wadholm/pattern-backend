const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require('dotenv').config();

const app = express();

//Routes
const auth = require('./api/routes/auth');
const users = require('./api/routes/users');

const port = 1337;

// Cors
app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined'));
}

app.use(express.json());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Middleware for all routes.
app.use((req, res, next) => {
    next();
});


// Add routes
app.use('/auth', auth);
app.use('/users', users);

// // Start up server
// app.listen(port, () => console.log(`Pattern API listening on port ${port}!`));

// Connect Mongoose

const uri = `
    mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}` +
    `@${process.env.DB_CLUSTER}.jr7l8.mongodb.net/${process.env.DB_NAME}` +
    `?retryWrites=true&w=majority`;

mongoose.connect(
    uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() => {
        app.listen(port, function () {
            console.log(`Pattern API listening on port ${port}!`);
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
