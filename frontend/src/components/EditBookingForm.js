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
//fetching booking details
  useEffect(() => {
    const fetchBooking = async () => {
      const data = await getBookingById(id);
      setBooking(data);
      setSelectedDate(new Date(data.eventDate));
    };
    fetchBooking();
  }, [id]);
//booking updating
  const handleSubmit = async (e) => {
    e.preventDefault();
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
          <EventForm booking={booking} setBooking={setBooking} />
          <button className="submitButton" type="submit">
            Update Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookingForm;
