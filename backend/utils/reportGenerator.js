const User = require('../models/User');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateUserReport = async (res) => {
  try {
    const users = await User.find();
    
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="user_report.pdf"');
    
    doc.pipe(res);
    doc.fontSize(18).text('User Management Report', { align: 'center' }).moveDown();
    
    users.forEach((user, index) => {
      doc.fontSize(12).text(`${index + 1}. ${user.fullName} - ${user.email} - ${user.role}`);
    });
    
    doc.end();
  } catch (error) {
    console.error(' Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};

module.exports = { generateUserReport };
