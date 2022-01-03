var express = require('express');
var router = express.Router();
// eslint-disable-next-line no-unused-vars
const checkAuth = require("../middleware/check-auth");

const UsersController = require("../controllers/users");

// get all users
router.get('/', UsersController.users_get_all);

// get user by id
router.get('/:userId', UsersController.users_get_user);

// register user
router.post('/register', UsersController.users_register);

// login user
router.post('/login', UsersController.users_login);

// update user by id
router.patch('/:userId', UsersController.users_update_user);

// // only for testing, change to soft delete
// router.delete('/:userId', checkAuth, UsersController.users_delete_user);


module.exports = router;
