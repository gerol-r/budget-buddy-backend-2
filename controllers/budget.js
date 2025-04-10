const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify-token.js');
const Income = require('../models/income');
const Expense = require('../models/expense');


// router.get('/', (req, res) => {
//     res.send(' Welcome to Budget Buddy!');
//   });
  

// add inc
router.post("/budget/incomes/add", async (req, res) => {
    const { userId, category, amount } = req.body;

    if (!userId || !category || !amount) {
        return res.status(400).json({ message: "Please provide all income fields" });
    }

    const newIncome = new Income({ userId, category, amount });
    const savedIncome = await newIncome.save();

    res.status(201).json({ message: "Income added", income: savedIncome });
});

// edit 
router.put("/budget/incomes/edit/:id", async (req, res) => {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Income updated", income });
});

// del 
router.delete("/budget/incomes/delete/:id", async (req, res) => {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted" });
});


// add exp
router.post("/budget/expenses/add", async (req, res) => {
    const { userId, category, amount } = req.body;

    if (!userId || !category || !amount) {
        return res.status(400).json({ message: "Please provide all expense fields" });
    }

    const newExpense = new Expense({ userId, category, amount });
    const savedExpense = await newExpense.save();

    res.status(201).json({ message: "Expense added", expense: savedExpense });
});
//edit
router.put("/budget/expenses/edit/:id", async (req, res) => {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Expense updated", expense });
});

// del
router.delete("/budget/expenses/delete/:id", async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
});

module.exports = router;
