const Booking = require("../models/Booking");

// Create a booking (Already Exists)
const createBooking = async (req, res) => {
  try {
    const { userId, eventType, eventDate, expectedCrowd, salonServices } = req.body;

    console.log("Received booking data:", req.body); // Log incoming data for debugging
    console.log("Received eventType:", eventType); // Log the eventType for debugging

    if (!userId || !eventType || !eventDate || !expectedCrowd || !salonServices) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    let bookingDate = new Date(eventDate);
    bookingDate.setMinutes(bookingDate.getMinutes() - bookingDate.getTimezoneOffset());
    const formattedDate = bookingDate.toISOString().split("T")[0];

    const existingBooking = await Booking.findOne({ eventDate: formattedDate });
    if (existingBooking) {
      return res.status(400).json({ error: "Selected date is already booked" });
    }

    const newBooking = new Booking({
      userId,
      eventType,
      expectedCrowd,
      salonServices,
      eventDate: formattedDate,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error); // Log the error for debugging
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// Get all booked dates (Already Exists)
const getBookedDates = async (req, res) => {
  try {
    const bookings = await Booking.find({}, "eventDate -_id");
    const bookedDates = bookings.map((booking) => {
      let date = new Date(booking.eventDate);
      date.setHours(0, 0, 0, 0);
      return date.toISOString().split("T")[0];
    });

    res.json(bookedDates);
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// 🆕 Get all bookings for a specific user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from params
    const bookings = await Booking.find({ userId });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// 🆕 Get booking details by ID
const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// 🆕 Edit/update booking details
const updateBooking = async (req, res) => {
  try {
    const { eventType, eventDate, expectedCrowd, salonServices } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the event date has passed
    const today = new Date().toISOString().split("T")[0];
    if (booking.eventDate < today) {
      return res.status(400).json({ error: "Past bookings cannot be edited" });
    }

    // Update details
    if (eventType) booking.eventType = eventType;
    if (eventDate) {
      let bookingDate = new Date(eventDate);
      bookingDate.setMinutes(bookingDate.getMinutes() - bookingDate.getTimezoneOffset());
      booking.eventDate = bookingDate.toISOString().split("T")[0];
    }
    if (expectedCrowd) booking.expectedCrowd = expectedCrowd;
    if (salonServices) booking.salonServices = salonServices;

    await booking.save();
    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// 🆕 Delete/cancel a booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the event date has passed
    const today = new Date().toISOString().split("T")[0];
    if (booking.eventDate < today) {
      return res.status(400).json({ error: "Past bookings cannot be cancelled" });
    }

    await Booking.findByIdAndDelete(req.params.bookingId);
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

module.exports = { 
  createBooking, 
  getBookedDates, 
  getUserBookings, 
  getBookingDetails, 
  updateBooking, 
  deleteBooking 
};
