const express = require('express');
const roleMiddleware = require('../middleware/roleMiddleware');
const verifyToken = require('../middleware/authMiddleware');

const User = require('../models/User');

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

router.put('/approve-provider/:email', verifyToken, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'service_provider') {
      return res.status(400).json({ message: 'User is not a service provider' });
    }
    
    // Update approval status
    user.approvalStatus = true;
    await user.save();
    
    res.status(200).json({ 
      message: 'Service provider approved successfully',
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        approvalStatus: user.approvalStatus
      }
    });
  } catch (error) {
    console.error('Error approving service provider:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// For testing purposes - non-authenticated version (use with caution)
router.put('/approve-provider-test/:email', async (req, res) => {
  try {

    const { email } = req.params;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update approval status
    user.approvalStatus = true;
    await user.save();
    
    res.status(200).json({ 
      message: 'Service provider approved successfully - TEST MODE',
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        approvalStatus: user.approvalStatus
      }
      
    });
  } catch (error) {
    console.error('Error approving service provider:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
