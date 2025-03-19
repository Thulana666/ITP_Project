const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'service_provider', 'admin'], default: 'customer' },
  phoneNumber: { type: String },
  serviceType: { type: String },
  mfaPreference: { type: Boolean, default: false },
  approvalStatus: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
