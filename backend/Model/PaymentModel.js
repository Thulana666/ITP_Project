const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    paymentMethod: { type: String, enum: ["Cash", "Bank Transfer"], required: true },
    paymentSlip: String,
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("Payment", PaymentSchema);