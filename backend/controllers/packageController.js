//packageController.js
const Package = require('../models/Package');

// Function to calculate total price with discount
const calculateDiscount = (selectedPackages) => {
    let totalPrice = selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
    
    // Apply 10% discount if 3 or more packages are selected
    if (selectedPackages.length >= 3) {
        totalPrice *= 0.9; // Apply 10% discount
    }
    
    return totalPrice;
};

// Get all packages
exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching packages: " + error.message });
    }
};

// Create a new package
exports.createPackage = async (req, res) => {
    try {
        const newPackage = new Package(req.body);
        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (error) {
        res.status(400).json({ message: "Error creating package: " + error.message });
    }
};

// Update a package
exports.updatePackage = async (req, res) => {
    try {
        const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPackage) return res.status(404).json({ message: 'Package not found' });
        res.json(updatedPackage);
    } catch (error) {
        res.status(400).json({ message: "Error updating package: " + error.message });
    }
};

// Delete a package
exports.deletePackage = async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);
        if (!deletedPackage) return res.status(404).json({ message: 'Package not found' });
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting package: " + error.message });
    }
};

// Seed sample packages into the database
exports.seedPackages = async (req, res) => {
    try {
        const samplePackages = [
            { serviceProvider: "Photographer", packageName: "Basic", price: 400000, description: "4-hour event shoot, 50 edited photos", discount: 0 },
            { serviceProvider: "Photographer", packageName: "Premium", price: 600000, description: "Full-day coverage, 150 edited photos, Video", discount: 0 },
            { serviceProvider: "Hotel", packageName: "Standard", price: 800000, description: "Venue, Basic decorations, With catering, Seating for 150 guests", discount: 0 },
            { serviceProvider: "Hotel", packageName: "Luxury", price: 1500000, description: "Venue, Premium decorations, With catering, Seating for 400 guests", discount: 0 },
            { serviceProvider: "Music Band", packageName: "Basic", price: 300000, description: "5-member band, 4 hours", discount: 0 },
            { serviceProvider: "Music Band", packageName: "Deluxe", price: 800000, description: "8 members, Full event coverage, Sound systems", discount: 0 }
        ];

        // Clear existing packages before seeding new ones
        await Package.deleteMany();
        await Package.insertMany(samplePackages);

        res.json({ message: "Sample packages added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error seeding packages: " + error.message });
    }
};

/**
 * Generate a report after applying discount
 * @param {Array} selectedPackageIds - Array of package IDs selected by the user
 * @returns {Object} Report containing selected package details and total price
 */
exports.generateReport = async (req, res) => {
    try {
        const { selectedPackageIds } = req.body;

        // Validate input: Ensure selectedPackageIds is provided
        if (!selectedPackageIds || selectedPackageIds.length === 0) {
            return res.status(400).json({ message: "No packages selected." });
        }

        // Fetch the selected packages from the database using their IDs
        const selectedPackages = await Package.find({ _id: { $in: selectedPackageIds } });

        // Check if any packages were found
        if (selectedPackages.length === 0) {
            return res.status(404).json({ message: "Selected packages not found." });
        }

        // Calculate the total price with possible discount
        const totalPrice = calculateDiscount(selectedPackages);

        // Generate a structured report
        const report = {
            selectedPackages: selectedPackages.map(pkg => ({
                serviceProvider: pkg.serviceProvider,
                packageName: pkg.packageName,
                description: pkg.description,
                price: pkg.price,
                discount: pkg.discount
            })),
            totalPrice: totalPrice,
            message: "Report generated successfully!"
        };

        // Send the report as a JSON response
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: "Error generating report: " + error.message });
    }
};
