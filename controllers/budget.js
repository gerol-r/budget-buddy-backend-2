const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Budget = require("../models/budget.js");
const router = express.Router();

// '/budgets'


// Index

router.get("/", verifyToken, async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Disable caching
        const budgets = await Budget.find({user: req.user._id}); //New* only find user specific budgets req.user._id
        res.status(200).json(budgets); // source for above https://stackoverflow.com/questions/61033910/mern-stack-application-same-data-appearing-in-other-users-dashboard
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

router.post("/", verifyToken, async (req, res) => {
    const { name, amount } = req.body;
    const {user} = req;
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
        // const budget = await Budget.findById(req.params.budgetId)
        const budget = await Budget.findOne({ //*NEW
            _id: req.params.budgetId, //still finding budget by id
            user: req.user._id // ensuring it is user-specific
        });
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});



//update
router.put("/:budgetId", verifyToken, async (req, res) => {
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
    const { name, amount } = req.body;
  
    if (!name || !amount) {
      return res.status(400).json({ error: "Name and amount required!" });
    }
  
    try {
      const budget = await Budget.findById(req.params.budgetId);
  
      if (!budget) {
        return res.status(404).json({ error: "Budget not found." });
      }
  
      if (!budget.user.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      const newExpense = {
        name,
        amount,
        user: req.user._id,
      };
  
      budget.expenses.push(newExpense);
      await budget.save();
  
      const updatedBudget = await Budget.findById(req.params.budgetId);
  
      if (!updatedBudget) {
        return res.status(404).json({ error: "Updated budget not found." });
      }
  
      res.status(201).json(updatedBudget); 
    } catch (error) {
      console.error("Failed to add expense:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
//update expense 

router.put('/:budgetId/expenses/:expenseId', verifyToken, async (req, res) => {
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

router.delete('/:budgetId/expenses/:expenseId', verifyToken, async (req, res) => {
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
