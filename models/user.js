const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/sequelize');

//Model creation
class User extends Model {}

//Model definition
User.init(
	{
		username: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{
		sequelize,
		timestamps: false,
		modelName: 'User'
	}
);

//Model sync
User.sync();

//Module exports
module.exports = User;
