const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0, //prevent negatives
  },
  user: { 
	type: mongoose.Schema.Types.ObjectId, 
	ref: "User", 
	required: true //IMPORTANT: was missing, but needed
},
});

const budgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
	min: 0
  },
  user: { 
	type: mongoose.Schema.Types.ObjectId, 
	ref: "User",
	required: true //IMPORTANT: was missing, but needed  
},
  expenses: [expenseSchema],
});

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
