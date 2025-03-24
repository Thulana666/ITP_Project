// backend/models/User.js
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
  isVerified: { type: Boolean, default: false }, // New field for email verification
  verificationCode: { type: String }, // Store OTP for verification
  verificationCodeExpires: { type: Date }, // Expiration time for verification code
  otp: { type: String }, // For login 2FA
  otpExpires: { type: Date }
});

const User = mongoose.model('User', userSchema);
module.exports = User;