const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  eventType: {
    type: String,
    enum: ["Wedding", "Graduation", "Birthday", "Corporate Event", "Other"], // Ensure "Corporate Event" is included
    required: true,
  },
  eventDate: {
    type: String, // Store as YYYY-MM-DD format to avoid time zone issues
    required: true,
  },
  expectedCrowd: {
    type: String,
    enum: ["0-50", "50-100", "100-500", "500-1000", "More than 1000"],
    required: true,
  },
  salonServices: {
    type: [String],
    required: true,
  },
});

// Ensure a date can only have one booking (Optional: Uncomment if needed)
// bookingSchema.index({ eventDate: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
