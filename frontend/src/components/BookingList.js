import React, { useState, useEffect } from "react";
import { getUserBookings, cancelBooking } from "../services/bookingService";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import "../styles/BookingList.css";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
//fetching user bookings
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      console.log(token);
      const decoded = jwtDecode(token);
      console.log(decoded);
    } else {
      navigate("/login");
    }
    const fetchBookings = async () => {

      const data = await getUserBookings(token);
      setBookings(data);
    };
    fetchBookings();
  }, []);
//cancel booking
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      await cancelBooking(id);
      setBookings(bookings.filter((booking) => booking._id !== id));
    }
  };
// past dates
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
