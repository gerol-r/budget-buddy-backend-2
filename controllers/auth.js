const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const saltRounds = 12;
const { getrandomavatar } = require("../utils/avatars");

router.post("/sign-up", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
      return res.status(409).json({ err: "Username already taken." });
    }

    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, saltRounds),
      income: req.body.income,
      savingsGoal: req.body.savingsGoal,
      avatar: getrandomavatar(),
    });

    const payload = {
      _id: user._id,
      username: user.username,
      income: user.income,
      savingsGoal: user.savingsGoal,
      avatar: user.avatar,
    };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ err: "Invalid credentials." });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: "Invalid credentials." });
    }

    const payload = {
      _id: user._id,
      username: user.username,
      income: user.income,
      savingsGoal: user.savingsGoal,
      avatar: user.avatar,
    };

    console.log(payload);

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
