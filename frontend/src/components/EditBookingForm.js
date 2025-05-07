import React, { useState, useEffect } from "react";
import { getBookingById, updateBooking } from "../services/bookingService";
import { useParams, useNavigate } from "react-router-dom";
import BookingCalendar from "./Calendar";
import EventForm from "./EventForm";
import "../styles/EditBookings.css";

const EditBookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [errors, setErrors] = useState({});

  //fetching booking details
  useEffect(() => {
    const fetchBooking = async () => {
      const data = await getBookingById(id);
      setBooking(data);
      setSelectedDate(new Date(data.eventDate));
    };
    fetchBooking();
  }, [id]);

  // Validate form data before submitting
  const validateForm = () => {
    const newErrors = {};

    if (!booking.eventType) {
      newErrors.eventType = "Select an event type";
    }
    if (!booking.expectedCrowd) {
      newErrors.expectedCrowd = "Select expected crowd";
    }
    if (!booking.salonServices || booking.salonServices.length === 0) {
      newErrors.salonServices = "Select at least one service";
    }
    if (!selectedDate || selectedDate.toDateString() === new Date().toDateString()) {
      newErrors.selectedDate = "Select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //booking updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    await updateBooking(id, { ...booking, eventDate: selectedDate });
    alert("Booking updated!");
    navigate("/manage-bookings");
  };

  if (!booking) return <p>Loading...</p>;

  return (
    <div className="edit-booking-container">
      <form onSubmit={handleSubmit}>
        <h2>Edit Booking</h2>
        <div className="edit-booking-form">
          <BookingCalendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <EventForm booking={booking} setBooking={setBooking} errors={errors} />
          <button className="submitButton" type="submit">
            Update Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookingForm;
