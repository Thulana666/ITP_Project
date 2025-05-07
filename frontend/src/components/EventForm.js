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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const [userId, setUserId] = useState(null); // State to hold userId
  const navigate = useNavigate(); 

  // Get token from localStorage and decode it to extract user ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch (error) {
      console.error("Invalid token specified:", error);
      navigate("/login");
    }
  }, [navigate]);

  // Update form data if booking changes
  useEffect(() => {
    if (booking) setFormData(booking);
  }, [booking]);

  // Handle changes in text inputs and update form data
  const handleChange = (e) => {
    const { name, value } = e.target; 
    const updatedData = { ...formData, [name]: value }; 
    setFormData(updatedData); 
    if (setBooking) setBooking(updatedData); 
  };

  // Handle checkbox changes 
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target; 
    const updatedServices = checked
      ? [...formData.salonServices, value]
      : formData.salonServices.filter((s) => s !== value);
    const updatedData = { ...formData, salonServices: updatedServices }; 
    setFormData(updatedData); 
    if (setBooking) setBooking(updatedData);
  };

  // Simplify the validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.eventType) {
      newErrors.eventType = "Select an event type";
    }
    if (!formData.expectedCrowd) {
      newErrors.expectedCrowd = "Select expected crowd";
    }
    if (formData.salonServices.length === 0) {
      newErrors.salonServices = "Select at least one service";
    }
    if (!selectedDate || selectedDate.toDateString() === new Date().toDateString()) {
      newErrors.selectedDate = "Select a date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simplify handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setLoading(true); 

    const localDate = new Date(selectedDate);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    const formattedDate = localDate.toISOString().split("T")[0]; 

    try {
      const response = await submitBooking({
        userId: userId, 
        eventType: formData.eventType,
        expectedCrowd: formData.expectedCrowd,
        salonServices: formData.salonServices,
        eventDate: formattedDate, 
      });

      if (response.success) {
        console.log(response.booking.booking._id); 
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
      setLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form-container">
      {/* Event Type Selection */}
      <label>Event Type:</label>
      <select 
        name="eventType" 
        value={formData.eventType} 
        onChange={handleChange}
      >
        <option value="">Select Event Type</option>
        <option value="Wedding">Wedding</option>
        <option value="Graduation">Graduation</option>
        <option value="Birthday">Birthday</option>
        <option value="Corporate Event">Corporate Event</option>
        <option value="Other">Other</option>
      </select>
      {errors.eventType && <span className="error-text">{errors.eventType}</span>}

      {/* Expected Crowd Selection */}
      <label>Expected Crowd:</label>
      <select 
        name="expectedCrowd" 
        value={formData.expectedCrowd} 
        onChange={handleChange}
      >
        <option value="">Select Crowd Size</option>
        <option value="0-50">0 - 50</option>
        <option value="50-100">50 - 100</option>
        <option value="100-500">100 - 500</option>
        <option value="500-1000">500 - 1000</option>
        <option value="More than 1000">More than 1000</option>
      </select>
      {errors.expectedCrowd && <span className="error-text">{errors.expectedCrowd}</span>}

      {/* Salon Services Selection */}
      <label>Salon Services:</label>
      <div className="checkbox-group">
        <label>
          <input 
            type="checkbox" 
            value="Hair Styling" 
            onChange={handleCheckboxChange} 
            checked={formData.salonServices.includes("Hair Styling")} 
          />
          Hair Styling - Rs. 5 000
        </label>
        <label>
          <input 
            type="checkbox" 
            value="Makeup" 
            onChange={handleCheckboxChange} 
            checked={formData.salonServices.includes("Makeup")} 
          />
          Makeup - Rs. 3 500
        </label>
        <label>
          <input 
            type="checkbox" 
            value="Dressing" 
            onChange={handleCheckboxChange} 
            checked={formData.salonServices.includes("Dressing")} 
          />
          Dressing - Rs 6 500
        </label>
      </div>
      {errors.salonServices && <span className="error-text">{errors.salonServices}</span>}

      {/* Event Date Validation */}
      {errors.selectedDate && <span className="error-text">{errors.selectedDate}</span>}

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
