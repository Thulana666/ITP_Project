const express = require("express");
const { 
    createReview, 
    getReviews, 
    updateReview, 
    deleteReview,
    getAllReviews,
    getReviewStats,
    getMonthlyReport
} = require("../controllers/reviewController");
const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all reviews (Public)
router.get("/", getAllReviews);

// Create a new review (Only authenticated users)
router.post("/", verifyToken, createReview);

// Get reviews for a specific service (Public)
router.get("/:serviceId", getReviews);

// Update a review (Only the user who created it)
router.put("/:reviewId", verifyToken, updateReview);

// Delete a review (Only Admins or the User who created it)
router.delete("/:reviewId", verifyToken, deleteReview);

// Get review statistics (Public)
router.get("/report", getReviewStats);

// Get monthly report (Public)
router.get("/monthly-report", getMonthlyReport);

module.exports = router;