const express = require('express');
const roleMiddleware = require('../middleware/roleMiddleware');
const verifyToken = require('../middleware/authMiddleware');
const User = require("../models/User");
const { generateUserReport } = require("../utils/reportGenerator");

const router = express.Router();

//  Protected Route: Admin Dashboard
router.get('/dashboard', verifyToken, roleMiddleware(['admin']), (req, res) => {
  res.status(200).json({ message: ' Welcome, Admin!' });
});

// Admin: View & Search Users
router.get('/users', verifyToken, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { search } = req.query; // Get search query
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } }, // Case-insensitive search for full name
          { email: { $regex: search, $options: 'i' } },   // Case-insensitive search for email
          { role: { $regex: search, $options: 'i' } }     // Case-insensitive search for role
        ]
      };
    }

    const users = await User.find(filter, '-password'); // Exclude passwords

    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//  Approve/Reject Service Provider
router.put(
  "/approve-service-provider/:id",
  verifyToken,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { approvalStatus } = req.body;
      if (typeof approvalStatus !== "boolean") {
        return res.status(400).json({ message: "Invalid approval status" });
      }

      const user = await User.findById(req.params.id);
      if (!user || user.role !== "service_provider") {
        return res.status(404).json({ message: "Service provider not found" });
      }

      user.approvalStatus = approvalStatus;
      await user.save();

      res.status(200).json({
        message: `Service provider ${approvalStatus ? "approved" : "rejected"} successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


//  Example: Admin Can View All Users (For Management)
router.get('/users', verifyToken, roleMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: ' Server error' });
  }
});

//  Update User Role
router.put(
  "/update-role/:id",
  verifyToken,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { role } = req.body;
      const validRoles = ["customer", "service_provider", "admin"];

      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role;
      await user.save();

      res.status(200).json({ message: "User role updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// Update User Details (Full Name, Email, Role)
router.put(
  "/update-user/:id",
  verifyToken,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { fullName, email, role } = req.body;

      // Validate Role
      const validRoles = ["customer", "service_provider", "admin"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Find and update user
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.fullName = fullName;
      user.email = email; // Ensure email is not lost
      user.role = role;

      await user.save();

      res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


//  Delete Any User
router.delete(
  "/delete-user/:id",
  verifyToken,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.deleteOne();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

//  Generate User Report (PDF)
router.get("/generate-report", verifyToken, roleMiddleware(["admin"]), async (req, res) => {
  generateUserReport(res);
});


module.exports = router;
