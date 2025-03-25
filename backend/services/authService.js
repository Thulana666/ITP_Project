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
    from: `"Bridal Salon Security Team" <${process.env.EMAIL_USER}>`, // Use a proper sender name
    to: email,
    subject: '🔐 Your Secure OTP Code - Bridal Salon',
    text: `
Hello,

Your one-time password (OTP) for secure login to your Bridal Salon account is: **${otp}**

🔹 This OTP is valid for **10 minutes**.  
🔹 If you did not request this, please ignore this email.

Thank you,  
**Bridal Salon Security Team**
    `,
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
