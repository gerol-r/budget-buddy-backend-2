const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Budget = require("../models/budget.js");
const router = express.Router();

// '/budget'


// Index

router.get("/", verifyToken, async (req, res) => {
    try {
        req.body.user = req.user._id;
        const budgets = await Budget.find({});
        //    .populate('user')  unsure if this line is needed to populate the user for referencing
        res.status(201).json(budgets);
    } catch (error) {
        res.status(500).json(error);
    }
});

// New (Not needed React front end handles this)

// Delete 
router.delete('/:budgetId', verifyToken, async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.budgetId);

        if (!budget.user.equals(req.user._id)) {
            return res.status(403).send("Unable to delete this budget");
        }

        const deletedBudget = await Budget.findByIdAndDelete(req.params.budgetId);
        res.status(200).json(deletedBudget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update

// Create 

router.post("/budgets", verifyToken, async (req, res) => {
    const { name, amount, user } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required!" });
    }
    if (!amount) {
        return res.status(400).json({ error: "Amount is required!" });
    }
    if (!user) {
        return res.status(400).json({ error: "User is required!" });
    }

    try {
        const newBudget = new Budget({
            name: name,
            amount: amount,
            user: user,
            expenses: []
        });
        const savedBudget = await newBudget.save();
        res.status(201).json({
            messege: "Created!",
            budget: savedBudget
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Show 

router.get('/:budgetId', verifyToken, async (req, res) => {
    try {
        // Use the findById method to find the budget 
        const budget = await Budget.findById(req.params.budgetId)
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});



//update
router.put("/budgets/:budgetId", verifyToken, async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.budgetId);

        if (!budget.user.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }
        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.budgetId,
            req.body,
            { new: true, }
        );
        res.status(200).json(updatedBudget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//post-expense 
router.post('/:budgetId/expenses', verifyToken, async (req, res) => {
    const { name, amount, category } = req.body;

    if (!name || !amount) {
        return res.status(400).json({ error: " Name and amount required! " });
    }

    try {
        const budget = await Budget.findById(req.params.budgetId);

        if (!budget.user.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }

        const newExpense = { name, amount, category };
        budget.expenses.push(newExpense);
        await budget.save();

        res.status(201).json({
            message: "Expense added!",
            expense: budget.expenses[budget.expenses.length - 1]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//update expense 

router.put('/:budgetsId/expenses/:expenseId', verifyToken, async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.budgetId);

        if (!budget.user.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to update this expense");
        }

        const expense = budget.expenses.id(req.params.expenseId);
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        expense.name = req.body.name || expense.name;
        expense.amount = req.body.amount || expense.amount;

        await expense.save();
        res.status(200).json({
            message: "Expense updated!",
            expense: expense
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//delete exp

router.put('/:budgetsId/expenses/:expenseId', verifyToken, async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.budgetId);

        if (!budget.user.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to update this expense");
        }

        const expense = budget.expenses.id(req.params.expenseId);
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        expense.remove();
        await budget.save();

        res.status(200).json({
            message: "Expense updated!",
            expense: expense
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
