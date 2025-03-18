const express = require("express");
const { check, validationResult, param } = require("express-validator");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { createPayment, getPayments, updatePaymentStatus } = require("../Controllers/PaymentControllers");

// Validation Error Handling Middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Payment Validation Middleware
const validatePayment = [
    check("userId").isMongoId().withMessage("Invalid User ID format"),
    check("amount")
        .isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),
    check("paymentMethod")
        .isIn(["Bank Transfer", "Cash"]).withMessage("Invalid payment method. Allowed: 'Bank Transfer' or 'Cash'"),
    handleValidationErrors
];

// Validate Object ID for PUT request
const validateObjectId = [
    param("id").isMongoId().withMessage("Invalid payment ID format"),
    handleValidationErrors
];

// Routes
router.post("/", upload.single("paymentSlip"), validatePayment, createPayment);
router.get("/", getPayments);
router.put("/:id", validateObjectId, updatePaymentStatus);

module.exports = router;



