const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    images: [String],
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;