// In your routes/serviceProviderRoutes.js
const express = require('express');
const roleMiddleware = require('../middleware/roleMiddleware');
const verifyToken = require('../middleware/authMiddleware'); //  Import
const {
  getServiceProviderProfile,
  updateServiceProviderProfile,
  deleteServiceProviderAccount
} = require('../controllers/serviceProviderController');

const router = express.Router();

// Service Provider Dashboard (Protected Route)
router.get('/dashboard', verifyToken, roleMiddleware(['service_provider']), (req, res) => {
  res.status(200).json({ message: 'Welcome, Service Provider!' });
});


//  GET Service Provider Profile
router.get('/profile', verifyToken, roleMiddleware(['service_provider']), getServiceProviderProfile);

//  UPDATE Service Provider Profile
router.put('/profile', verifyToken, roleMiddleware(['service_provider']), updateServiceProviderProfile);

//  DELETE Service Provider Account
router.delete('/profile', verifyToken, roleMiddleware(['service_provider']), deleteServiceProviderAccount);

module.exports = router;



