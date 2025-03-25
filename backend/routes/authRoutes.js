const express = require('express');
const router = express.Router(); //  Initialize router at the top
const verifyToken = require('../middleware/authMiddleware'); //  Import verifyToken middleware
const { generateUserReport } = require('../utils/reportGenerator');

// Controllers
const { 
  registerUser, 
  loginUser, 
  verifyOTP, 
} = require('../controllers/authController');
const { getCustomerProfile, updateCustomerProfile, deleteCustomerAccount } = require('../controllers/customerController'); //  Correct import


router.get('/report', async (req, res) => {
    await generateUserReport(res);
  });
  

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);

// Customer Profile Routes (for customers to view, update, and delete their profile)
router.get('/profile', verifyToken, getCustomerProfile); // View Profile
router.put('/profile', verifyToken, updateCustomerProfile); // Update Profile
router.delete('/profile', verifyToken, deleteCustomerAccount); // Delete Account

router.get('/report', async (req, res) => {
    await generateUserReport(res);
});

console.log(' Auth routes loaded...');
module.exports = router;
