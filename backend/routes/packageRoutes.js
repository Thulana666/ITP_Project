// backend/routes/packageRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const Package = require('../models/Package');

// Get all packages (Public route)
router.get('/', async (req, res) => {
    try {
        const packages = await Package.find()
            .populate({
                path: 'createdBy',
                select: 'fullName serviceType',
                model: 'User'
            });
        
        // Transform the data to include service provider details
        const transformedPackages = packages.map(pkg => {
            const provider = pkg.createdBy || {};
            return {
                _id: pkg._id,
                packageName: pkg.packageName,
                description: pkg.description,
                price: pkg.price,
                discount: pkg.discount,
                serviceType: provider.serviceType || 'Unknown',  // Fallback value
                serviceProvider: provider.fullName || 'Unknown', // Fallback value
                createdBy: provider._id
            };
        });

        res.json(transformedPackages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching packages: " + error.message });
    }
});

// Get packages by service provider ID (Protected)
router.get('/provider', verifyToken, roleMiddleware(['service_provider']), async (req, res) => {
    try {
        const userId = req.user.id;
        const packages = await Package.find({ createdBy: userId });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching packages: " + error.message });
    }
});

// Create a new package (Protected)
router.post('/', verifyToken, roleMiddleware(['service_provider', 'admin']), async (req, res) => {
    try {
        // Add the user ID as the creator
        const newPackage = new Package({
            ...req.body,
            createdBy: req.user.id
        });
        
        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (error) {
        res.status(400).json({ message: "Error creating package: " + error.message });
    }
});

// Update a package (Protected)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        // Find the package
        const packageToUpdate = await Package.findById(req.params.id);
        
        // Check if package exists
        if (!packageToUpdate) {
            return res.status(404).json({ message: 'Package not found' });
        }
        
        // Check if the user is the creator (service provider) or an admin
        if (packageToUpdate.createdBy && 
            packageToUpdate.createdBy.toString() !== req.user.id && 
            req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this package' });
        }
        
        // Update the package
        const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPackage);
    } catch (error) {
        res.status(400).json({ message: "Error updating package: " + error.message });
    }
});

// Delete a package (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // Find the package
        const packageToDelete = await Package.findById(req.params.id);
        
        // Check if package exists
        if (!packageToDelete) {
            return res.status(404).json({ message: 'Package not found' });
        }
        
        // Check if the user is the creator (service provider) or an admin
        if (packageToDelete.createdBy && 
            packageToDelete.createdBy.toString() !== req.user.id && 
            req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this package' });
        }
        
        // Delete the package
        await Package.findByIdAndDelete(req.params.id);
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting package: " + error.message });
    }
});

// Generate a report for selected packages
router.post('/generate-report', async (req, res) => {
    try {
        const { selectedPackageIds } = req.body;

        // Validate input
        if (!selectedPackageIds || selectedPackageIds.length === 0) {
            return res.status(400).json({ message: "No packages selected." });
        }

        // Fetch the selected packages
        const selectedPackages = await Package.find({ _id: { $in: selectedPackageIds } });
        
        if (selectedPackages.length === 0) {
            return res.status(404).json({ message: "Selected packages not found." });
        }

        // Calculate total with possible discount
        let totalPrice = selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
        
        // Check if discount should be applied (packages from 3 different categories)
        const categories = new Set(selectedPackages.map(pkg => pkg.serviceProvider));
        const discountApplied = categories.size >= 3;
        
        if (discountApplied) {
            totalPrice *= 0.9; // Apply 10% discount
        }

        // Generate report
        const report = {
            selectedPackages: selectedPackages.map(pkg => ({
                id: pkg._id,
                serviceProvider: pkg.serviceProvider,
                packageName: pkg.packageName,
                description: pkg.description,
                price: pkg.price,
                discount: pkg.discount
            })),
            totalPrice: totalPrice,
            discountApplied: discountApplied,
            discountPercentage: discountApplied ? 10 : 0,
            message: "Report generated successfully!"
        };

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: "Error generating report: " + error.message });
    }
});

// Service provider stats
router.get('/stats', verifyToken, roleMiddleware(['service_provider']), async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get the service provider's packages
        const packages = await Package.find({ createdBy: userId });
        
        // For now, return basic stats
        const stats = {
            totalPackages: packages.length,
            totalCustomers: Math.floor(Math.random() * 100),  // Simulated data
            totalRevenue: Math.floor(Math.random() * 1000000)  // Simulated data
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats: " + error.message });
    }
});

module.exports = router;