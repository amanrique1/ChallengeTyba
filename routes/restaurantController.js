var express = require('express');
var Restaurant = require('../logic/restaurantsService');
var middleware = require('../middleware.js');
var router = express.Router();

Restaurant = new Restaurant();

//Get near restaurants
router.get(
	'/',
	middleware.checkToken,
	Restaurant.getNearRestaurants,
	middleware.logOperation
);

module.exports = router;
