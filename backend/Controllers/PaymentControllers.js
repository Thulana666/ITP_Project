// PaymentControllers.js
const { validationResult } = require("express-validator");
const Payment = require("../models/PaymentModel");

// Create a Payment
exports.createPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, firstName, lastName, email, phone, paymentMethod, amount } = req.body;
    const paymentSlip = req.file ? req.file.filename : null;

    // Validate paymentSlip for Bank Transfer
    if (paymentMethod === "Bank Transfer" && !paymentSlip) {
      return res.status(400).json({ 
        error: "Payment slip is required for Bank Transfer" 
      });
    }

    const newPayment = new Payment({
      userId,
      firstName,
      lastName,
      email,
      phone,
      paymentMethod,
      amount,
      paymentSlip,
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ 
      error: "Error creating payment", 
      details: error.message 
    });
  }
};

// Fetch All Payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ 
      error: "Error fetching payments",
      details: error.message
    });
  }
};

// Get Payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    
    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ 
      error: "Error fetching payment",
      details: error.message
    });
  }
};

// Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    payment.status = "Paid";
    await payment.save();
    
    res.status(200).json({ 
      message: "Payment status updated to Paid",
      payment
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ 
      error: "Error updating payment status",
      details: error.message
    });
  }
};

// Delete a Payment
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndDelete(id);
    
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    
    res.status(200).json({ 
      message: "Payment successfully deleted",
      id
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ 
      error: "Error deleting payment",
      details: error.message
    });
  }
};