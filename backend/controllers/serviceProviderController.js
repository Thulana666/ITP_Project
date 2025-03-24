// backend/controllers/serviceProviderController.js
const Package = require('../models/Package');
const User = require('../models/User');

// Get service provider statistics
exports.getProviderStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get provider's packages
    const packages = await Package.find({ createdBy: userId });
    
    // In a real application, you would calculate actual bookings, revenue, etc.
    // For now, we'll return simulated data
    const stats = {
      totalPackages: packages.length,
      totalCustomers: Math.floor(Math.random() * 100),  // Simulated data
      totalRevenue: packages.reduce((sum, pkg) => sum + (pkg.price * Math.floor(Math.random() * 10)), 0)  // Simulated data
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get service provider dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get the provider info
    const provider = await User.findById(userId).select('-password -otp -otpExpires');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    // Welcome message
    res.status(200).json({ 
      message: 'Welcome to your dashboard, ' + provider.fullName,
      provider: {
        name: provider.fullName,
        email: provider.email,
        role: provider.role,
        serviceType: provider.serviceType,
        approvalStatus: provider.approvalStatus
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};