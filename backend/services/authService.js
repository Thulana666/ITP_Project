const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for MFA',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(' OTP sent successfully');
  } catch (error) {
    console.error(' Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

module.exports = { generateOTP, sendOTPEmail };
