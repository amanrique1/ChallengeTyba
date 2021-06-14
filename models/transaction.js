const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/sequelize');

//Model creation
class Transaction extends Model {}

//Model definition
Transaction.init(
	{
		path: {
			type: DataTypes.STRING,
			allowNull: false
		},
		requestType: {
			type: DataTypes.STRING,
			allowNull: false
		},
		responseCode: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		dateTime: {
			type: DataTypes.DATE,
			allowNull: false
		}
	},
	{
		sequelize,
		timestamps: false,
		modelName: 'Transaction'
	}
);

//Model sync
Transaction.sync();

//Module exports
module.exports = Transaction;
