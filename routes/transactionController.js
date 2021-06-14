var express = require('express');
var Transaction = require('../logic/transactionService');
var router = express.Router();
var middleware = require('../middleware.js');

Transaction = new Transaction();

//Get all the logs
router.get(
	'/',
	middleware.checkToken,
	Transaction.getAll,
	middleware.logOperation
);

module.exports = router;
