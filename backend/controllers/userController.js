// backend/controllers/userController.js
const User = require('../models/User');

// Get the authenticated user's profile
exports.getUserProfile = async (req, res) => {
  try {
    // The req.user.id is set by the authMiddleware
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires -verificationCode -verificationCodeExpires');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, mfaPreference } = req.body;
    
    // Only allow updating specific fields
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (mfaPreference !== undefined) updateData.mfaPreference = mfaPreference;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password -otp -otpExpires -verificationCode -verificationCodeExpires');
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get service provider public profile
exports.getProviderProfile = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    // Only select public fields
    const provider = await User.findById(providerId).select('fullName email phoneNumber serviceType role');
    
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    
    // Verify this is actually a service provider
    if (provider.role !== 'service_provider') {
      return res.status(400).json({ message: 'Requested user is not a service provider' });
    }
    
    res.status(200).json(provider);
  } catch (error) {
    console.error('Error fetching provider profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProviderByPackage = async (req, res) => {
  try {
    // First, find the package to get its creator
    const { packageId } = req.params;
    
    // Import the Package model here to avoid circular dependencies
    const Package = require('../models/Package');
    
    const packageInfo = await Package.findById(packageId);
    
    if (!packageInfo) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    if (!packageInfo.createdBy) {
      return res.status(400).json({ message: 'Package does not have creator information' });
    }
    
    // Get the provider details
    const provider = await User.findById(packageInfo.createdBy)
      .select('fullName email phoneNumber serviceType');
    
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    
    res.status(200).json(provider);
  } catch (error) {
    console.error('Error fetching provider from package:', error);
    res.status(500).json({ message: 'Server error' });
  }
};