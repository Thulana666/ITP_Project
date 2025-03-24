// backend/routes/serviceProviderRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Service Provider Dashboard (Protected Route)
router.get('/dashboard', verifyToken, roleMiddleware(['service_provider']), (req, res) => {
    res.status(200).json({ message: 'Welcome, Service Provider!' });
});

// Service Provider Statistics
router.get('/stats', verifyToken, roleMiddleware(['service_provider']), (req, res) => {
    // Simple mock stats for now
    const stats = {
        totalPackages: Math.floor(Math.random() * 10),
        totalCustomers: Math.floor(Math.random() * 100),
        totalRevenue: Math.floor(Math.random() * 100000)
    };
    
    res.status(200).json(stats);
});

// Get provider's packages
router.get('/packages', verifyToken, roleMiddleware(['service_provider']), async (req, res) => {
    try {
        // The user ID is available from the auth middleware
        const userId = req.user.id;
        
        // Import Package model directly in this route handler to avoid circular dependencies
        const Package = require('../models/Package');
        
        // Find packages by this user's ID as creator
        const packages = await Package.find({ createdBy: userId });
        
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching packages: " + error.message });
    }
});

module.exports = router;