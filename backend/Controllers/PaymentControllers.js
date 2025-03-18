const { validationResult, body, param } = require("express-validator");
const Payment = require("../Model/PaymentModel");

// Validation Middleware for Create Payment
exports.validatePayment = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("phone")
    .isMobilePhone()
    .withMessage("Invalid phone number format"),
  body("paymentMethod")
    .isIn(["Cash", "Bank Transfer"])
    .withMessage("Invalid payment method"),
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
];

// Create a Payment
exports.createPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, email, phone, paymentMethod, amount } = req.body;
    const paymentSlip = req.file ? req.file.filename : null;

    const newPayment = new Payment({
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
    res.status(500).json({ error: "Error creating payment" });
  }
};

// Fetch All Payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching payments" });
  }
};

// Validation Middleware for Updating Payment Status
exports.validatePaymentId = [
  param("id").isMongoId().withMessage("Invalid payment ID"),
];

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
    
    res.status(200).json({ message: "Payment updated" });
  } catch (error) {
    res.status(500).json({ error: "Error updating payment status" });
  }
};
