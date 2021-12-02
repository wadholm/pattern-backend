var express = require('express');
var router = express.Router();
const checkAuth = require("../middleware/check-auth");

const CitiesController = require("../controllers/cities");

// get all cities
router.get('/', CitiesController.cities_get_all);

// get city by id
router.get('/:cityId', CitiesController.cities_get_city);

// get all stations by city
router.get('/stations/:cityId', CitiesController.cities_get_stations);

// get station by id
router.get('/station/:stationId', CitiesController.cities_get_station);

// add city
router.post('/', CitiesController.cities_add_city);

// update city by id
router.patch('/:cityId', CitiesController.cities_update_city);

// add station
router.post('/:cityId', CitiesController.cities_add_station);

// update station by id
router.patch('/station/:stationId', CitiesController.cities_update_station);

// only for testing, change to soft delete
router.delete('/:cityId', checkAuth, CitiesController.cities_delete_city);


module.exports = router;
