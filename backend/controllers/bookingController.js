const mongoose = require("mongoose");
const Booking = require("../models/Booking");

// Create a booking 
const createBooking = async (req, res) => {
  try {
    const { userId, eventType, eventDate, expectedCrowd, salonServices } = req.body;

    console.log("Received booking data:", req.body); 
    console.log("Received eventType:", eventType); 

    if (!userId || !eventType || !eventDate || !expectedCrowd || !salonServices) {
      return res.status(400).json({ error: "All fields are required!" });
    }
//converts date into formated date
    let bookingDate = new Date(eventDate);
    bookingDate.setMinutes(bookingDate.getMinutes() - bookingDate.getTimezoneOffset());
    const formattedDate = bookingDate.toISOString().split("T")[0];
//availability check
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
//save booking with above details
    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// Get all booked dates
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

// Get all bookings for a specific user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ userId });

    res.json(bookings);
    // Only log if bookings exist and have items
    if (bookings && bookings.length > 0) {
      console.log("User bookings:", bookings[0].id);
    }
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// Get booking details by ID
const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    console.log("Booking details:", booking); 
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// update booking details
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

// Delete a booking
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

// Add new method for updating packages
const updateBookingPackages = async (req, res) => {
  try {
    const { packages, totalPrice } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Enhanced validation for packages array
    if (!Array.isArray(packages) || packages.length === 0) {
      return res.status(400).json({ error: "At least one package is required" });
    }

    // Validate each package has required fields and correct types
    const formattedPackages = packages.map(pkg => {
      if (!pkg.serviceType || !pkg.packageId || !pkg.packageName || !pkg.price) {
        throw new Error("Missing required package fields");
      }

      return {
        serviceType: pkg.serviceType,
        packageId: new mongoose.Types.ObjectId(pkg.packageId),
        packageName: pkg.packageName,
        price: Number(pkg.price)
      };
    });

    // Update booking with validated data
    booking.packages = formattedPackages;
    booking.totalPrice = Number(totalPrice);

    await booking.save();
    res.json({
      success: true,
      message: "Packages updated successfully",
      booking
    });

  } catch (error) {
    console.error("Error updating booking packages:", error);
    res.status(500).json({ 
      error: "Server error. Please try again.",
      details: error.message 
    });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

module.exports = { 
  createBooking, 
  getBookedDates, 
  getUserBookings, 
  getBookingDetails, 
  updateBooking, 
  deleteBooking,
  updateBookingPackages,
  getAllBookings 
};
