var express = require('express');
var router = express.Router();
// eslint-disable-next-line no-unused-vars
const checkAuth = require("../middleware/check-auth");

const AdminsController = require("../controllers/admins");

// get all admins
router.get('/', AdminsController.admins_get_all);

// get admin by id
router.get('/:adminId', AdminsController.admins_get_admin);

// register admin
router.post('/register', AdminsController.admins_register);

// login admin
router.post('/login', AdminsController.admins_login);

// update admin by id
router.patch('/:adminId', AdminsController.admins_update_admin);

// // only for testing, change to soft delete
// router.delete('/:adminId', AdminsController.admins_delete_admin);


module.exports = router;
