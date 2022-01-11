var express = require('express');
var router = express.Router();
// eslint-disable-next-line no-unused-vars
const checkAuth = require("../middleware/check-auth");

const BikesController = require("../controllers/bikes");

// get all bikes
router.get('/', checkAuth, BikesController.bikes_get_all);

// get all bikes by city
router.get('/city/:cityId', checkAuth, BikesController.bikes_get_by_city);

// get bike by id
router.get('/:bikeId', checkAuth, BikesController.bikes_get_bike);

// add bike
router.post('/', checkAuth, BikesController.bikes_add_bike);

// update bike by id
router.patch('/:bikeId', checkAuth, BikesController.bikes_update_bike);

// maintenance for bike by id
router.put('/maintenance/:bikeId', checkAuth, BikesController.bikes_maintenance);

// // only for testing, change to soft delete
// router.delete('/:bikeId', checkAuth, BikesController.bikes_delete_bike);

module.exports = router;
