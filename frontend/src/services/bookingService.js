import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings";

export const getBookedDates = async () => {
  try {
    const response = await axios.get(`${API_URL}/booked-dates`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return [];
  }
};

export const submitBooking = async (data) => {
  try {
    console.log("Submitting booking:", data); // Debugging log
    const response = await axios.post(API_URL, data);
    return { success: true, booking: response.data };
  } catch (error) {
    console.error("Booking error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || "Server error. Please try again." };
  }
};

// New functions for managing bookings
export const getUserBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/641d2f9b8f1b2c001c8e4d3a`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/details/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
  }
};

export const updateBooking = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/edit/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
  }
};

export const cancelBooking = async (id) => {
  try {
    await axios.delete(`${API_URL}/cancel/${id}`);
  } catch (error) {
    console.error("Error canceling booking:", error);
  }
};
