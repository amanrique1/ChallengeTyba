const axios = require('axios');
const config = require('../config.json');
class Restaurant {
	/**
	 * Get the restaurants from a zone
	 * @param req user HTTP request
	 * @param res HTTP response to the user
	 */
	async getNearRestaurants(req, res, next) {
		const cityInfo = req.body.cityInfo;
		const locationInfo = req.body.location;
		console;
		let url = '';
		if (cityInfo) {
			//Data cleaning and parsing for the valid variables using city
			let category = req.body.category;
			category = category !== undefined ? category + '+' : '';
			let neighborhood = cityInfo.neighborhood;
			neighborhood = neighborhood !== undefined ? neighborhood + '+' : '';
			let borough = cityInfo.borough;
			borough = borough !== undefined ? borough + '+' : '';
			let city = cityInfo.city;
			city = city !== undefined ? city : '';
			if (city === '' && neighborhood == '' && neighborhood == '') {
				res.status(400).json({
					message: 'You must provide at least one field of the city info'
				});
			} else {
				//Remove spaces to prevent crashes
				category.replace(/\s/g, '+');
				neighborhood.replace(/\s/g, '+');
				borough.replace(/\s/g, '+');
				city.replace(/\s/g, '+');
				url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${category}+${neighborhood}+${borough}+${city}&type=restaurant&key=${config.apiKey}`;
			}
		} else if (locationInfo) {
			try {
				//Data cleaning and parsing for the valid variables using location
				let category = req.body.category;
				category = category !== undefined ? 'query=' + category + '&' : '';
				category.replace(/\s/g, '+');
				let latitude = locationInfo.latitude;
				let longitude = locationInfo.longitude;

				//Check undefined values
				if (locationInfo.latitude && locationInfo.longitude) {
					latitude = parseFloat(latitude);
					longitude = parseFloat(longitude);

					//Check latitude and longitude validity
					if (
						latitude >= -90 &&
						latitude <= 90 &&
						longitude >= -180 &&
						longitude <= 180
					) {
						url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${category}location=${latitude},${longitude}&type=restaurant&key=${config.apiKey}`;
					} else {
						res.status(400).json({
							message: 'You must provide valid latitude and longitude'
						});
					}
				} else {
					res.status(400).json({
						message:
							'You must provide the latitude and longitude for the location'
					});
				}
			} catch (e) {
				res.status(400).json({
					message: 'The latitude and longitude must be numbers'
				});
			}
		} else {
			res.status(400).json({
				message: "The input doesn't have a city or a location"
			});
		}
		if (url !== '') {
			try {
				//Call the api
				const { data } = await axios.get(url);
				res.json(data.results);
			} catch (err) {
				res.status(500).json({ error: err.message });
			}
		}
		next();
	}
}
module.exports = Restaurant;
