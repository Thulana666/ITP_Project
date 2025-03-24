// PaymentModel.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters"],
        maxlength: [50, "First name cannot exceed 50 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters"],
        maxlength: [50, "Last name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Bank Transfer"],
        required: [true, "Payment method is required"]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0.01, "Amount must be greater than 0"]
    },
    paymentSlip: {
        type: String,
        validate: {
            validator: function (value) {
                if (this.paymentMethod === "Bank Transfer" && !value) {
                    return false;
                }
                return true;
            },
            message: "Payment slip is required for Bank Transfer"
        }
    },
    status: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Payment", PaymentSchema);