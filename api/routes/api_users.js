var express = require('express');
var router = express.Router();

const ApiController = require("../controllers/api_users");

// register api users
router.post('/register', ApiController.api_register);

module.exports = router;
