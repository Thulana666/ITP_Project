import React, { useState, useEffect } from "react";
import "../styles/BookingForm.css";
import { submitBooking } from "../services/bookingService";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const EventForm = ({ selectedDate, booking, setBooking }) => {
  const [formData, setFormData] = useState(
    booking || {
      eventType: "",
      expectedCrowd: "",
      salonServices: [],
    }
  );

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  const userId = decoded.id;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return null;
    } 
    if (booking) setFormData(booking);
  }, [booking]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state for submission

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    if (setBooking) setBooking(updatedData); // Update parent state if editing
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updatedServices = checked
      ? [...formData.salonServices, value]
      : formData.salonServices.filter((s) => s !== value);
    const updatedData = { ...formData, salonServices: updatedServices };
    setFormData(updatedData);
    if (setBooking) setBooking(updatedData); // Update parent state if editing
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.eventType) newErrors.eventType = "Event Type is required";
    if (!formData.expectedCrowd) newErrors.expectedCrowd = "Crowd size is required";
    if (formData.salonServices.length === 0) newErrors.salonServices = "Select at least one service";
    if (!selectedDate || selectedDate.toDateString() === new Date().toDateString()) {
      newErrors.selectedDate = "Please select a date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Show loading while submitting

    // Convert selectedDate to local date before sending
    const localDate = new Date(selectedDate);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    const formattedDate = localDate.toISOString().split("T")[0];

    try {
      const response = await submitBooking({
        userId: userId,//"641d2f9b8f1b2c001c8e4d3a", // Replace with a valid user ID
        eventType: formData.eventType,
        expectedCrowd: formData.expectedCrowd,
        salonServices: formData.salonServices,
        eventDate: formattedDate,
      });

      if (response.success) {
        console.log(response.booking.booking._id);
        // Navigate to packages page with booking ID
        navigate(`/packages`, {
          state: { bookingId: response.booking.booking._id }
        });
      } else {
        console.error("Server responded with an error:", response.error);
        alert(response.error || "Booking failed!");
      }
    } catch (error) {
      console.error("Error during booking submission:", error);
      alert("An error occurred while booking. Please try again.");
    } finally {
      setLoading(false); // Hide loading after request finishes
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form-container">
      {/* Event Type Selection */}
      <label>Event Type:</label>
      <select name="eventType" value={formData.eventType} onChange={handleChange} required>
        <option value="">Select Event Type</option>
        <option value="Wedding">Wedding</option>
        <option value="Graduation">Graduation</option>
        <option value="Birthday">Birthday</option>
        <option value="Corporate Event">Corporate Event</option> {/* Ensure this matches the backend */}
        <option value="Other">Other</option>
      </select>
      {errors.eventType && <p className="error-message">{errors.eventType}</p>}

      {/* Expected Crowd Selection */}
      <label>Expected Crowd:</label>
      <select name="expectedCrowd" value={formData.expectedCrowd} onChange={handleChange} required>
        <option value="">Select Crowd Size</option>
        <option value="0-50">0 - 50</option>
        <option value="50-100">50 - 100</option>
        <option value="100-500">100 - 500</option>
        <option value="500-1000">500 - 1000</option>
        <option value="More than 1000">More than 1000</option>
      </select>
      {errors.expectedCrowd && <p className="error-message">{errors.expectedCrowd}</p>}

      {/* Salon Services Selection */}
      <label>Salon Services:</label>
      <div className="checkbox-group">
        <label>
          <input type="checkbox" value="Hair Styling" onChange={handleCheckboxChange} checked={formData.salonServices.includes("Hair Styling")} />
          Hair Styling - Rs. 5 000
        </label>
        <label>
          <input type="checkbox" value="Makeup" onChange={handleCheckboxChange} checked={formData.salonServices.includes("Makeup")} />
          Makeup - Rs. 3 500
        </label>
        <label>
          <input type="checkbox" value="Dressing" onChange={handleCheckboxChange} checked={formData.salonServices.includes("Dressing")} />
          Dressing - Rs 6 500
        </label>
      </div>
      {errors.salonServices && <p className="error-message">{errors.salonServices}</p>}

      {/* Event Date Validation */}
      {errors.selectedDate && <p className="error-message">{errors.selectedDate}</p>}

      {/* Submit Button */}
      {!booking && (
        <button type="submit" className="booking-button" disabled={loading}>
          {loading ? "Booking..." : "Book Now"}
        </button>
      )}
    </form>
  );
};

export default EventForm;
