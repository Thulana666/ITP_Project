const express = require('express');
const bcrypt = require("bcryptjs");
const verifyToken = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const User = require("../models/User");
const {
  getCustomerProfile,
  updateCustomerProfile,
  deleteCustomerAccount
} = require('../controllers/customerController');

const router = express.Router();

//  GET Customer Profile
router.get('/profile', verifyToken, roleMiddleware(['customer']), getCustomerProfile);

//  UPDATE Customer Profile
router.put('/profile', verifyToken, roleMiddleware(['customer']), updateCustomerProfile);

//  DELETE Customer Account
router.delete('/profile', verifyToken, roleMiddleware(['customer']), deleteCustomerAccount);

//  CHANGE PASSWORD (NEW ROUTE) 
router.put("/change-password", verifyToken, roleMiddleware(["customer"]), async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both passwords are required." });
  }

  try {
    const customer = await User.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    customer.password = await bcrypt.hash(newPassword, 10);
    await customer.save();
    
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
