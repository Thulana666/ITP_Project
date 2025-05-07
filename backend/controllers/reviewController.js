const mongoose = require("mongoose");
const Review = require("../models/Review");
const User = require("../models/User");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
}
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// **1. Create a Review**
exports.createReview = async(req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error("Upload Error:", err);
                return res.status(400).json({ message: err.message });
            }

            console.log("File:", req.file); // Add this for debugging
            console.log("Body:", req.body); // Add this for debugging

            const { serviceId, comment, eventDate, title } = req.body;
            const rating = Number(req.body.rating); // Convert rating to number explicitly

            // Check for required fields
            if (!serviceId || !comment || !rating || !eventDate || !title) {
                return res.status(400).json({ message: "Service ID, title, comment, rating, and event date are required." });
            }

            // Validate title length
            if (title.length < 3 || title.length > 100) {
                return res.status(400).json({ 
                    message: "Title must be between 3 and 100 characters long." 
                });
            }

            // Validate eventDate
            if (!Date.parse(eventDate)) {
                return res.status(400).json({ message: "Invalid event date format." });
            }

            // Ensure rating is a valid number
            if (isNaN(rating) || rating < 1 || rating > 5) {
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
                userName,
                title,      // Add title field
                comment,
                rating, // This is now guaranteed to be a number
                eventDate: new Date(eventDate),
                images: req.file ? [req.file.filename] : []
            });

            await newReview.save();
            res.status(201).json({ message: "Review added successfully", review: newReview });
        });
    } catch (error) {
        console.error("Review Creation Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// **2. Get All Reviews (for listing)**
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error("Get All Reviews Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// **3. Get Reviews for a Specific Service**
exports.getReviews = async(req, res) => {
    try {
        const { search, minRating, sort } = req.query;
        const { serviceId } = req.params;
        console.log(req.params)

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

// **4. Update a Review**
exports.updateReview = async(req, res) => {
    try {
        const { comment, rating, images, title } = req.body;
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

        // Validate title if it's being updated
        if (title) {
            if (title.length < 3) {
                return res.status(400).json({ message: "Title must be at least 3 characters long." });
            }
            if (title.length > 100) {
                return res.status(400).json({ message: "Title cannot exceed 100 characters." });
            }
            review.title = title;
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

// **5. Delete a Review**
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

// **6. Get Review Statistics**
exports.getReviewStats = async (req, res) => {
    try {
        const totalReviews = await Review.countDocuments();
        
        const ratingsData = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ]);
        
        const averageRating = ratingsData.length > 0 ? ratingsData[0].averageRating : 0;
        
        res.json({
            totalReviews,
            averageRating
        });
    } catch (error) {
        console.error("Review Stats Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// **7. Get Monthly Report**
exports.getMonthlyReport = async (req, res) => {
    try {
        const monthlyData = await Review.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: "$rating" }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 12 }
        ]);
        
        res.json(monthlyData);
    } catch (error) {
        console.error("Monthly Report Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};