var express = require('express');
var router = express.Router();

const ApiController = require("../controllers/api_users");

// api register form
router.get("/key", ApiController.api_register_form);

// api deregister form
router.get("/key/deregister", ApiController.api_deregister_form);

// register api users
router.post('/register', ApiController.api_register);

// deregister api users
router.post('/deregister', ApiController.api_deregister);


module.exports = router;
