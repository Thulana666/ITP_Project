const express = require('express');
const router = express.Router(); //  Initialize router at the top
const { generateUserReport } = require('../utils/reportGenerator');

const { registerUser, loginUser, verifyOTP } = require('../controllers/authController');
router.get('/report', async (req, res) => {
    await generateUserReport(res);
  });
  


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.get('/report', async (req, res) => {
    await generateUserReport(res);
  });

console.log(' Auth routes loaded...');
module.exports = router;
