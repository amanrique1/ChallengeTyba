const TransactionModel = require('../models/transaction');
class Transaction {
	async getAll(req, res, next) {
		try {
			const transactions = await TransactionModel.findAll();
			res.json({
				transactions: transactions
			});
		} catch (error) {
			return res.status(500).json({
				message: 'Something went wrong! please try again'
			});
		}
		next();
	}
}
module.exports = Transaction;
