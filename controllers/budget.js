const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify-token.js');
const Income = require('../models/income');
const Expense = require('../models/expense');



// crate 
router.post("/budgets", verifyToken, async (req, res)=> {
    const { name, amount, user } = req.body;
 if (!name){
    return res.status(400).json({error: "Name is required!"});
 }
 if (!amount){
    return res.status(400).json({error: "Amount is required!"});
 }
 if (!user){
    return res.status(400).json({error: "User is required!"});
 }

    try {
const newBudget = new Budget({
    name: name,
    amount: amount,
    user: user,
    expenses: []
});
const savedBudget = await newBudget.save();
res.status (201).json({
    messege: "Created!"
    budget: savedBudget
});
}catch (error) {
    res.status(500).json(error);
}
});
 

module.exports = router;