let jwt = require('jsonwebtoken');
let md5 = require('md5');
let config = require('../config.json');
const User = require('../models/user');

class Authentication {
	/**
	 * Verifies if the user exist in the DB and generates a JWT
	 * @param req user HTTP request
	 * @param res HTTP response to the user
	 */
	async login(req, res, next) {
		let username = req.body.username;
		let password = req.body.password;

		if (username && password) {
			let pass = md5(password);
			try {
				let user = await User.findOne({
					where: { username: username, password: pass }
				});
				if (user) {
					let acToken = jwt.sign({ username: username }, config.secret, {
						expiresIn: '3h'
					});
					await user.update({ token: acToken });
					res.json({
						token: acToken
					});
				} else {
					res.status(403).json({
						message: 'Incorrect username or password'
					});
				}
			} catch (err) {
				console.log(err);
				res.status(500).json({ error: error.message });
			}
		} else {
			res.status(400).json({
				message: 'Authentication failed! Please check the sent fields'
			});
		}
		next();
	}

	/**
	 * Register the user in the DB
	 * @param req user HTTP request
	 * @param res HTTP response to the user
	 */
	async register(req, res, next) {
		const username = req.body.username;
		const pass = req.body.password;
		if (username && pass) {
			const hashedPass = md5(pass);
			let user = await User.findOne({
				where: { username: username }
			});
			console.log(user);
			if (user) {
				res.status(400).json({
					message: 'Sign Up failed! The user is already registered'
				});
			} else if (username.length < 3 && pass.length < 3) {
				res.status(400).json({
					message: 'Sign Up failed! Please check the fields length'
				});
			} else {
				try {
					await User.create({
						username: username,
						password: hashedPass
					});
					res.sendStatus(204);
				} catch (error) {
					res.status(500).json({ error: error.message });
				}
			}
		} else {
			res.status(400).json({
				message: 'Authentication failed! Please check the sent fields'
			});
		}
		next();
	}

	/**
	 * Verifies if the user exist in the DB and generates a JWT
	 * @param req user HTTP request
	 * @param res HTTP response to the user
	 */
	logout(req, res, next) {
		let token = req.headers['x-access-token'] || req.headers['authorization'];

		if (token) {
			if (token.startsWith('Bearer ') || token.startsWith('bearer ')) {
				token = token.slice(7, token.length);
				jwt.verify(token, config.secret, async (err, decoded) => {
					if (err) {
						res.status(403).json({
							message: 'Token is not valid'
						});
					} else {
						console.log('Valid token');
						try {
							let user = await User.findOne({
								where: { token: token }
							});
							if (user) {
								await user.update({ token: null });
								res.sendStatus(204);
							} else {
								res.status(400).json({
									message: 'Unknown token'
								});
							}
						} catch (error) {
							res.status(500).json({ error: error.message });
						}
					}
				});
			} else {
				res.status(400).json({
					message: "Auth token doesn't have the format"
				});
			}
		} else {
			res.status(403).json({
				message: 'Auth token is not supplied'
			});
		}
		next();
	}
}
module.exports = Authentication;
