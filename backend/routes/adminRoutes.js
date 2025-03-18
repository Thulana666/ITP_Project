const express = require('express');
const roleMiddleware = require('../middleware/roleMiddleware');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

//  Protected Route: Admin Dashboard
router.get('/dashboard', verifyToken, roleMiddleware(['admin']), (req, res) => {
  res.status(200).json({ message: ' Welcome, Admin!' });
});

//  Example: Admin Can View All Users (For Management)
router.get('/users', verifyToken, roleMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: ' Server error' });
  }
});

module.exports = router;
