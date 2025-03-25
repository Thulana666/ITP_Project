const express = require("express");
const { 
  createBooking, 
  getBookedDates, 
  getUserBookings, 
  getBookingDetails, 
  updateBooking, 
  deleteBooking 
} = require("../controllers/bookingController"); // Ensure getBookedDates is exported
const validateBooking = require("../middleware/validation");
const Booking = require("../models/Booking");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
      console.log("Received booking request:", req.body); // Debugging log
  
      if (!req.body.eventType || !req.body.expectedCrowd || !req.body.salonServices.length) {
        return res.status(400).json({ error: "All fields are required!" });
      }
  
      const bookingDate = new Date(req.body.eventDate);
      bookingDate.setUTCHours(0, 0, 0, 0);
  
      const alreadyBooked = await Booking.findOne({ eventDate: bookingDate.toISOString().split("T")[0] });
  
      if (alreadyBooked) {
        return res.status(400).json({ error: "This date is already booked!" });
      }
  
      const newBooking = new Booking({
        userId: req.body.userId, // "641d2f9b8f1b2c001c8e4d3a", // Replace with a valid user ID from your database
        eventType: req.body.eventType,
        expectedCrowd: req.body.expectedCrowd,
        salonServices: req.body.salonServices,
        eventDate: bookingDate.toISOString().split("T")[0],
      });
  
      await newBooking.save();
      res.json({ message: "Booking successful!" });
  
    } catch (error) {
      console.error("Booking failed:", error);
      res.status(500).json({ error: "Server error. Please try again." });
    }
  });
  
router.get("/booked-dates", getBookedDates); // Ensure getBookedDates is defined

router.get("/:userId", getUserBookings); // Get all bookings for a user
router.get("/details/:bookingId", getBookingDetails); // Get details of a booking
router.put("/edit/:bookingId", updateBooking); // Edit booking details
router.delete("/cancel/:bookingId", deleteBooking); // Cancel a booking

module.exports = router;
