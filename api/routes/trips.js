var express = require('express');
var router = express.Router();
// eslint-disable-next-line no-unused-vars
const checkAuth = require("../middleware/check-auth");

const TripsController = require("../controllers/trips");

// get all trips
router.get('/', checkAuth, TripsController.trips_get_all);

// get all trips per user
router.get('/user/:userId', checkAuth, TripsController.trips_get_by_user);

// get trip by id
router.get('/:tripId', checkAuth, TripsController.trips_get_trip);

// start trip
router.post('/', checkAuth, TripsController.trips_start_trip);

// update trip by id
router.patch('/:tripId', checkAuth, TripsController.trips_update_trip);

// end trip by id
router.patch('/end/:tripId', checkAuth, TripsController.trips_end_trip);

// // only for testing, change to soft delete
// router.delete('/:tripId', checkAuth, TripsController.trips_delete_trip);

module.exports = router;
