const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventType: {
    type: String,
    enum: ["Wedding", "Graduation", "Birthday", "Corporate Event", "Other"], 
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
  packages: [{
    serviceType: { type: String, required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, required: true },
    packageName: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: {
    type: Number,
    default: 0
  }
});


module.exports = mongoose.model("Booking", bookingSchema);
