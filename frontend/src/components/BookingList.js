import React, { useState, useEffect } from "react";
import { getUserBookings, cancelBooking } from "../services/bookingService";
import { useNavigate } from "react-router-dom";
import "../styles/BookingList.css";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getUserBookings();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      await cancelBooking(id);
      setBookings(bookings.filter((booking) => booking._id !== id));
    }
  };

  const isPastDate = (eventDate) => {
    const today = new Date().toISOString().split("T")[0];
    return eventDate < today;
  };

  return (
    <div className="booking-list-wrapper">
      <h2>Manage My Bookings</h2>
      <div className="booking-list-container">
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <ul className="booking-list">
            {bookings.map((booking) => (
              <li key={booking._id} className="booking-item">
                <span>
                  {booking.eventType} - {booking.eventDate}
                </span>
                <div className="empty-div"></div>
                <button onClick={() => navigate(`/booking/${booking._id}`)}>
                  View
                </button>
                <button
                  onClick={() => navigate(`/edit-booking/${booking._id}`)}
                  disabled={isPastDate(booking.eventDate)}
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/booking/${booking._id}`)}
                  disabled={isPastDate(booking.eventDate)}
                >
                  Payment
                </button>
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="delete-btn"
                  disabled={isPastDate(booking.eventDate)}
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookingList;
