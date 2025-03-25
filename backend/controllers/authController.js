// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail, sendVerificationEmail } = require('../services/authService');

const registerUser = async (req, res) => {
  const { fullName, email, password, isServiceProvider, role, phoneNumber, serviceType, mfaPreference } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Restrict admin registration to specific emails
    const allowedAdminEmails = ["chamutharu482@gmail.com"];
    if (role === "admin" && !allowedAdminEmails.includes(email)) {
      return res.status(403).json({ message: "You are not allowed to register as an admin!" });
    }

    // Generate verification code
    const verificationCode = generateOTP();
    const verificationCodeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create user based on role
    if (isServiceProvider) {
      if (!role || !phoneNumber || !serviceType) {
        return res.status(400).json({ message: 'Missing required service provider details' });
      }

      user = new User({
        fullName,
        email,
        password: hashedPassword,
        role: 'service_provider',
        phoneNumber,
        serviceType,
        mfaPreference,
        approvalStatus: true, 
        isVerified: false, 
        verificationCode,
        verificationCodeExpires
      });

    } else if (role === "admin") {
      user = new User({
        fullName,
        email,
        password: hashedPassword,
        role: "admin",
        phoneNumber,
        mfaPreference,
        isVerified: false,
        verificationCode,
        verificationCodeExpires
      });

    } else {
      user = new User({
        fullName,
        email,
        password: hashedPassword,
        role: 'customer',
        isVerified: false,
        verificationCode,
        verificationCodeExpires
      });
    }

    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode, fullName);

    res.status(201).json({ 
      message: 'User registered successfully! Please check your email for verification instructions.',
      email: email 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ 
      email, 
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Mark user as verified and remove verification code
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Generate token for auto login after verification
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in email verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Resend verification code
 */
const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification code
    const verificationCode = generateOTP();
    const verificationCodeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode, user.fullName);

    res.status(200).json({ message: 'Verification code resent successfully!' });
  } catch (error) {
    console.error('Error resending verification code:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check if user has verified their email
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: user.email
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Handle 2FA if enabled for login
    if (user.mfaPreference) {
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await User.updateOne({ email }, { otp, otpExpires });
      await sendOTPEmail(email, otp);
      return res.status(200).json({ message: 'OTP sent to email', require2FA: true });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Return token and basic user info
    res.status(200).json({ 
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Verify OTP for login (2FA)
 */

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await User.updateOne({ email }, { $unset: { otp: '', otpExpires: '' } });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error in OTP verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  verifyOTP, 
  verifyEmail, 
  resendVerificationCode 
};