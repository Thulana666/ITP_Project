const User = require('../models/User');
const bcrypt = require('bcryptjs');

//  Get Service Provider Profile
const getServiceProviderProfile = async (req, res) => {
  try {
    const serviceProvider = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!serviceProvider) return res.status(404).json({ message: 'Service Provider not found' });

    res.status(200).json(serviceProvider);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Update Service Provider Profile
const updateServiceProviderProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, serviceType, password } = req.body;
    const serviceProvider = await User.findById(req.user.id);

    if (!serviceProvider) return res.status(404).json({ message: 'Service Provider not found' });

    if (fullName) serviceProvider.fullName = fullName;
    if (phoneNumber) serviceProvider.phoneNumber = phoneNumber;
    if (serviceType) serviceProvider.serviceType = serviceType;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      serviceProvider.password = await bcrypt.hash(password, salt);
    }

    await serviceProvider.save();
    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Delete Service Provider Account
const deleteServiceProviderAccount = async (req, res) => {
  try {
    const serviceProvider = await User.findById(req.user.id);

    if (!serviceProvider) return res.status(404).json({ message: 'Service Provider not found' });

    await User.deleteOne({ _id: req.user.id });
    res.status(200).json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getServiceProviderProfile,
  updateServiceProviderProfile,
  deleteServiceProviderAccount
};
