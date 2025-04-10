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

module.exports = router;
