import axios from "axios";
import {jwtDecode} from "jwt-decode";

const API_URL = "http://localhost:5000/api/bookings";
//get booked dates
export const getBookedDates = async () => {
  try {
    const response = await axios.get(`${API_URL}/booked-dates`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return [];
  }
};
//submit booking
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

// all the bookings for one user
export const getUserBookings = async (token) => {
  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id; 
    
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/details/${id}`);
    console.log(response);
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
