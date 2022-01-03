var express = require('express');
var router = express.Router();
const checkAuth = require("../middleware/check-auth");

const PriceController = require("../controllers/prices");

// get price
router.get('/', PriceController.prices_get);

// add price
router.post('/', PriceController.prices_add);

// update price by id
router.patch('/:priceId', checkAuth, PriceController.prices_update);

// // only for testing, change to soft delete
// router.delete('/:priceId', checkAuth, PriceController.prices_delete);

module.exports = router;
