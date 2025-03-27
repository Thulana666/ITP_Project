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

// Modify getPackages to filter by service provider
exports.getPackages = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from auth middleware
        const packages = await Package.find({ serviceProvider: userId });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching packages: " + error.message });
    }
};

// Modify createPackage to include service provider
exports.createPackage = async (req, res) => {
    try {
        const newPackage = new Package({
            ...req.body,
            serviceProvider: req.user.id // Add the service provider ID from auth
        });
        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (error) {
        res.status(400).json({ message: "Error creating package: " + error.message });
    }
};

// Add ownership check to updatePackage
exports.updatePackage = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) return res.status(404).json({ message: 'Package not found' });
        
        // Check if the package belongs to the logged-in service provider
        if (package.serviceProvider.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this package' });
        }

        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedPackage);
    } catch (error) {
        res.status(400).json({ message: "Error updating package: " + error.message });
    }
};

// Add ownership check to deletePackage
exports.deletePackage = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) return res.status(404).json({ message: 'Package not found' });
        
        // Check if the package belongs to the logged-in service provider
        if (package.serviceProvider.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this package' });
        }

        await Package.findByIdAndDelete(req.params.id);
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting package: " + error.message });
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
