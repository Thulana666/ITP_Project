// PaymentRoutes.js
const express = require("express");
const { check, param, validationResult } = require("express-validator");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { 
  createPayment, 
  getPayments, 
  getPaymentById,
  updatePaymentStatus,
  deletePayment
} = require("../controllers/PaymentControllers");

// Validation middleware
const validatePayment = [
  check("userId")
    .isMongoId()
    .withMessage("Invalid User ID format"),
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  check("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  check("email")
    .isEmail()
    .withMessage("Invalid email format"),
  check("phone")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),
  check("paymentMethod")
    .isIn(["Cash", "Bank Transfer"])
    .withMessage("Invalid payment method. Allowed: 'Bank Transfer' or 'Cash'"),
  check("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
];

// Validate MongoDB ObjectId
const validateObjectId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid payment ID format"),
];

// Routes
router.post(
  "/", 
  upload.single("paymentSlip"), 
  validatePayment, 
  createPayment
);

router.get("/", getPayments);
router.get("/:id", validateObjectId, getPaymentById);
router.put("/:id/status", validateObjectId, updatePaymentStatus);
router.delete("/:id", validateObjectId, deletePayment);

module.exports = router;