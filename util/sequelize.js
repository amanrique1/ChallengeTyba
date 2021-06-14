const { Sequelize } = require('sequelize');

//Create DB connection
const sequelize = new Sequelize('ChallengeTyba', 'postgres', 'admin', {
	host: 'localhost',
	dialect: 'postgres'
});

//Authenticate with the DB
sequelize.authenticate().then(() => {
	console.log('Authenticated!');
});

module.exports = sequelize;
