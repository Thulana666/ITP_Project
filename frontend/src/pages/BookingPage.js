import React, { useState } from "react";
import BookingCalendar from "../components/Calendar";
import EventForm from "../components/EventForm";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
