// In your routes/serviceProviderRoutes.js
const express = require('express');
const roleMiddleware = require('../middleware/roleMiddleware');
const verifyToken = require('../middleware/authMiddleware'); //  Import

const router = express.Router();

// Service Provider Dashboard (Protected Route)
router.get('/dashboard', verifyToken, roleMiddleware(['service_provider']), (req, res) => {
    res.status(200).json({ message: 'Welcome, Service Provider!' });
});

module.exports = router;