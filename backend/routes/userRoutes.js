// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

// Protected routes
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateUserProfile);

// Public route to get provider profile by ID
router.get('/provider/:providerId', userController.getProviderProfile);

// Alternative public route to get provider by package
router.get('/provider-by-package/:packageId', userController.getProviderByPackage);

module.exports = router;