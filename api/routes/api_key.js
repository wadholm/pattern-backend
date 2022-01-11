var express = require('express');
var router = express.Router();

const ApiController = require("../controllers/api_users");

// api register form
router.get("/", ApiController.api_register_form);

// api deregister form
router.get("/deregister", ApiController.api_deregister_form);


module.exports = router;
