// backend/services/authService.js
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a properly configured transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE, // Use the host directly instead of 'service'
  port: 587, // Standard SMTP port
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

/**
 * Generate a 6-digit OTP code
 * @returns {string} 6-digit OTP code
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Send OTP email for login verification
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code
 * @returns {Promise} Result of sending email
 */
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your One-Time Password for Login',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066cc;">Login Verification</h2>
        <p>Your one-time password (OTP) for login is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  try {
    console.log("Attempting to send OTP email to:", email);
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

/**
 * Send verification email when user signs up
 * @param {string} email - Recipient email address
 * @param {string} code - Verification code
 * @param {string} fullName - User's full name
 * @returns {Promise} Result of sending email
 */
const sendVerificationEmail = async (email, code, fullName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Account - Event Management',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066cc;">Welcome to Event Management!</h2>
        <p>Hello ${fullName},</p>
        <p>Thank you for signing up. To complete your registration, please verify your email address using the verification code below:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
          ${code}
        </div>
        <p>This code will expire in 1 hour.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  try {
    console.log("Attempting to send verification email to:", email);
    console.log("Using SMTP settings:", {
      host: process.env.EMAIL_SERVICE,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: "**hidden**"
      }
    });
    
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Verify the connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to send messages");
  }
});

module.exports = { generateOTP, sendOTPEmail, sendVerificationEmail };