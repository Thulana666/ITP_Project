// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  verifyOTP, 
  verifyEmail, 
  resendVerificationCode 
} = require('../controllers/authController');
const { getUserProfile } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const { generateUserReport } = require('../utils/reportGenerator');

//Auth end points
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/verify-email-sp', verifyEmail);
router.post('/resend-verification', resendVerificationCode);

// Profile endpoint
router.get('/profile', verifyToken, getUserProfile);

// Report endpoint
router.get('/report', async (req, res) => {
  await generateUserReport(res);
});

console.log('Auth routes loaded...');
module.exports = router;