var express = require('express');
var router = express.Router();
const checkAuth = require("../middleware/check-auth");

const BikesController = require("../controllers/bikes");

// get all bikes
router.get('/', BikesController.bikes_get_all);

// get all bikes by city
router.get('/city/:cityId', BikesController.bikes_get_by_city);

// get bike by id
router.get('/:bikeId', BikesController.bikes_get_bike);

// add bike
router.post('/', BikesController.bikes_add_bike);

// update bike by id
router.patch('/:bikeId', BikesController.bikes_update_bike);

// add bike
router.put('/:bikeId', BikesController.bikes_add_bike);

// maintenance for bike by id
router.put('/maintenance/:bikeId', BikesController.bikes_maintenance);

// only for testing, change to soft delete
router.delete('/:bikeId', checkAuth, BikesController.bikes_delete_bike);

module.exports = router;
