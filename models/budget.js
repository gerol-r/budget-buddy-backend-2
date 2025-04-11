const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const budgetSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	expenses: [expenseSchema],
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;