const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        // Skip validation if password is already hashed (bcrypt produces a 60-char string)
        if (value.startsWith("$2b$")) return true;
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      },
      message: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.'
    }
  },
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
