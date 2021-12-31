let express = require('express');
let router = express.Router();

const AuthController = require("../controllers/auth.js");

// OAuth
router.post("/", AuthController.auth);

module.exports = router;
