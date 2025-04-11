const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Budget = require("../models/budget.js");
const router = express.Router();

// '/budget'

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


// crate 
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

module.exports = router;
