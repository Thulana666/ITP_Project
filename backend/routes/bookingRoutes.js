const express = require("express");
const { 
  createBooking, 
  getBookedDates, 
  getUserBookings, 
  getBookingDetails, 
  updateBooking, 
  deleteBooking,
  updateBookingPackages,
  getAllBookings
} = require("../controllers/bookingController"); // Ensure getBookedDates is exported
const validateBooking = require("../middleware/validation");
const Booking = require("../models/Booking");

const router = express.Router();

router.post("/", validateBooking, async (req, res) => {
    try {
        console.log("Received booking request:", req.body);
//formats the date
        const bookingDate = new Date(req.body.eventDate);
        bookingDate.setUTCHours(0, 0, 0, 0);

        const alreadyBooked = await Booking.findOne({ eventDate: bookingDate.toISOString().split("T")[0] });
//date availability check
        if (alreadyBooked) {
            return res.status(400).json({ error: "This date is already booked!" });
        }

        const newBooking = new Booking({
            userId: req.body.userId,
            eventType: req.body.eventType,
            expectedCrowd: req.body.expectedCrowd,
            salonServices: req.body.salonServices,
            eventDate: bookingDate.toISOString().split("T")[0],
            packagesList: []
        });

        await newBooking.save();
        res.json({ message: "Booking successful!", booking: newBooking });

    } catch (error) {
        console.error("Booking failed:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
});

router.get("/all", getAllBookings); 
router.get("/booked-dates", getBookedDates); 
router.get("/:userId", getUserBookings); // Get all bookings for a user
router.get("/details/:bookingId", getBookingDetails); // Get details of a booking
router.put("/edit/:bookingId", updateBooking); // Edit booking details
router.delete("/cancel/:bookingId", deleteBooking); // Cancel a booking
router.put('/:bookingId/packages', updateBookingPackages);

module.exports = router;
