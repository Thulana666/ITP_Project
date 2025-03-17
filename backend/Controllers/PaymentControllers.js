const Payment = require("../Model/PaymentModel");

// Create a Payment
exports.createPayment = async (req, res) => {
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

// Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    await Payment.findByIdAndUpdate(id, { status: "Paid" });
    res.status(200).json({ message: "Payment updated" });
  } catch (error) {
    res.status(500).json({ error: "Error updating payment status" });
  }
};