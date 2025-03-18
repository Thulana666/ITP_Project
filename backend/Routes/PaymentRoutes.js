const express = require("express");
const { check, validationResult, param } = require("express-validator");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { createPayment, getPayments, updatePaymentStatus } = require("../Controllers/PaymentControllers");

// Validation Middleware
const validatePayment = [
    check("userId").notEmpty().withMessage("User ID is required"),
    check("amount")
        .isNumeric().withMessage("Amount must be a number")
        .custom(value => value > 0).withMessage("Amount must be greater than zero"),
    check("paymentMethod").isIn(["Bank Transfer", "Credit Card", "Cash"])
        .withMessage("Invalid payment method"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validate Object ID for PUT request
const validateObjectId = [
    param("id").isMongoId().withMessage("Invalid payment ID format"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Routes
router.post("/", upload.single("paymentSlip"), validatePayment, createPayment);
router.get("/", getPayments);
router.put("/:id", validateObjectId, updatePaymentStatus);

module.exports = router;


