import React, { useState, useEffect } from "react";
import BookingCalendar from "../components/Calendar";
import EventForm from "../components/EventForm";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
    }, [navigate]);
  return (
    <div className="booking-container">
      <div>
    <h2>Book An Event</h2>
    </div>
      <div className="booking-content">
        <div className="calendar-container">
          <BookingCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>
        <div className="booking-form">
          <EventForm selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
