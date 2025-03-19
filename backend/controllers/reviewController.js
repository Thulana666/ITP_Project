const mongoose = require("mongoose");
const Review = require("../models/Review");
const User = require("../models/User");

// **1. Create a Review**
exports.createReview = async(req, res) => {
    try {
        const { serviceId, comment, rating, images } = req.body;

        // Check for required fields
        if (!serviceId || !comment || !rating) {
            return res.status(400).json({ message: "Service ID, comment, and rating are required." });
        }

        // Ensure rating is a valid number
        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
        }

        // Comment length validation
        if (comment.length < 10) {
            return res.status(400).json({ message: "Comment must be at least 10 characters long." });
        }
        
        if (comment.length > 500) {
            return res.status(400).json({ message: "Comment cannot exceed 500 characters." });
        }
        
        // Content filtering for inappropriate language (basic example)
        const inappropriateWords = ['badword1', 'badword2', 'badword3']; // Add actual words to filter
        const containsInappropriate = inappropriateWords.some(word => 
            comment.toLowerCase().includes(word.toLowerCase())
        );
        
        if (containsInappropriate) {
            return res.status(400).json({ 
                message: "Your comment contains inappropriate language. Please revise your comment." 
            });
        }

        // Ensure `req.user` exists
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }

        // Fetch the user from DB to get `fullName`
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure `user.fullName` exists
        const userName = user.fullName || "Anonymous";

        const newReview = new Review({
            serviceId,
            userId: req.user.id,
            userName: userName,
            comment,
            rating,
            images,
        });

        await newReview.save();
        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        console.error("Review Creation Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// **2. Get Reviews (Search & Filter)**
exports.getReviews = async(req, res) => {
    try {
        const { search, minRating, sort } = req.query;
        const { serviceId } = req.params;

        // Ensure serviceId is valid
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({ message: "Invalid service ID format." });
        }

        const query = { serviceId };

        // Search by username or comment
        if (search) {
            query.$or = [
                { userName: { $regex: search, $options: "i" } },
                { comment: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by rating
        if (minRating) {
            query.rating = { $gte: parseInt(minRating) };
        }

        // Sorting logic
        let sortOption = {};
        if (sort === "newest") sortOption = { createdAt: -1 };
        if (sort === "highest") sortOption = { rating: -1 };
        if (sort === "lowest") sortOption = { rating: 1 };

        const reviews = await Review.find(query).sort(sortOption);
        res.json(reviews);
    } catch (error) {
        console.error("Get Reviews Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// **3. Update a Review**
exports.updateReview = async(req, res) => {
    try {
        const { comment, rating, images } = req.body;
        const { reviewId } = req.params;

        // Ensure reviewId is valid
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: "Invalid review ID format." });
        }

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Ensure user is authorized to update
        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        // Validate comment if it's being updated
        if (comment) {
            if (comment.length < 10) {
                return res.status(400).json({ message: "Comment must be at least 10 characters long." });
            }
            
            if (comment.length > 500) {
                return res.status(400).json({ message: "Comment cannot exceed 500 characters." });
            }
            
            // Content filtering for inappropriate language
            const inappropriateWords = ['badword1', 'badword2', 'badword3']; // Add actual words to filter
            const containsInappropriate = inappropriateWords.some(word => 
                comment.toLowerCase().includes(word.toLowerCase())
            );
            
            if (containsInappropriate) {
                return res.status(400).json({ 
                    message: "Your comment contains inappropriate language. Please revise your comment." 
                });
            }
            
            review.comment = comment;
        }

        // Update other fields if provided
        if (rating) {
            if (typeof rating !== "number" || rating < 1 || rating > 5) {
                return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
            }
            review.rating = rating;
        }
        
        if (images) review.images = images;

        await review.save();

        res.json({ message: "Review updated successfully", review });
    } catch (error) {
        console.error("Update Review Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// **4. Delete a Review**
exports.deleteReview = async(req, res) => {
    try {
        const { reviewId } = req.params;

        // Ensure reviewId is valid
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: "Invalid review ID format." });
        }

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Ensure user is authorized (Owner or Admin)
        if (review.userId.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        await review.deleteOne();
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete Review Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};