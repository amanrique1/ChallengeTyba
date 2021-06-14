let jwt = require('jsonwebtoken');
const config = require('./config.json');
const User = require('./models/user');
const Transaction = require('./models/transaction');

/**
 * Check the token's validity
 * @param req user HTTP request
 * @param res HTTP response to the user
 * @param next Callback argument to the middleware function
 * @returns Error message if not valid or continue with the function
 */
let checkToken = (req, res, next) => {
	// Get token from headers
	let token = req.headers['x-access-token'] || req.headers['authorization'];

	if (token) {
		if (token.startsWith('Bearer ') || token.startsWith('bearer ')) {
			token = token.slice(7, token.length);
			jwt.verify(token, config.secret, async (err, decoded) => {
				if (err) {
					return res.status(403).json({
						message: 'Token is not valid'
					});
				} else {
					console.log('Valid token');
					req.decoded = decoded;
					try {
						let user = await User.findOne({
							where: { token: token }
						});
						if (user) {
							next();
						} else {
							return res.status(400).json({
								message: 'Unknown token'
							});
						}
					} catch (error) {
						return res.status(500).json({
							message: 'Something went wrong! please try again'
						});
					}
				}
			});
		} else {
			return res.status(400).json({
				message: "Auth token doesn't have the format"
			});
		}
	} else {
		return res.status(403).json({
			message: 'Auth token is not supplied'
		});
	}
};

let logOperation = async (req, res) => {
	try {
		await Transaction.create({
			path: req.originalUrl,
			requestType: req.method,
			responseCode: res.statusCode,
			dateTime: Date.now()
		});
	} catch (error) {
		console.log('Error!!!! transaction not created');
	}
};

module.exports = {
	checkToken: checkToken,
	logOperation: logOperation
};
