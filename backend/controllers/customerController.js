const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get Customer Profile
const getCustomerProfile = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Update Customer Profile
const updateCustomerProfile = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const customer = await User.findById(req.user.id);

    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    if (fullName) customer.fullName = fullName;
    if (email) customer.email = email;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      customer.password = await bcrypt.hash(password, salt);
    }

    await customer.save();
    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Delete Customer Account
const deleteCustomerAccount = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id);

    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    await User.deleteOne({ _id: req.user.id });
    res.status(200).json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCustomerProfile, updateCustomerProfile, deleteCustomerAccount };
