var express = require('express');
var Authentication = require('../logic/authenticationService.js');
var router = express.Router();
var middleware = require('../middleware.js');

Authentication = new Authentication();

//User login
router.post('/login', Authentication.login, middleware.logOperation);

//User register
router.post('/register', Authentication.register, middleware.logOperation);

//User log out
router.delete('/logout', Authentication.logout, middleware.logOperation);

module.exports = router;
