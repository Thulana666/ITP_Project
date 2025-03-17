const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { createPayment, getPayments, updatePaymentStatus } = require("../Controllers/PaymentControllers");

router.post("/", upload.single("paymentSlip"), createPayment);
router.get("/", getPayments);
router.put("/:id", updatePaymentStatus);

module.exports = router;

