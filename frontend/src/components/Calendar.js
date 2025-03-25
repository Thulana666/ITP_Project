import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";
import { getBookedDates } from "../services/bookingService";

const BookingCalendar = ({ selectedDate, onDateChange }) => {
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const dates = await getBookedDates();
        setBookedDates(dates);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };

    // Fetch booked dates every second (1000ms)
    fetchBookedDates();
    const interval = setInterval(fetchBookedDates, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Get tomorrow's date

  const isDateDisabled = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return date <= tomorrow || bookedDates.includes(formattedDate);
  };

  return (
    <Calendar
      onChange={onDateChange}
      value={selectedDate}
      tileDisabled={({ date }) => isDateDisabled(date)}
      tileClassName={({ date }) => {
        const formattedDate = date.toISOString().split("T")[0];

        if (date.toDateString() === today.toDateString()) return "today-date"; // Highlight today
        if (date <= tomorrow) return "past-date"; // Style past dates
        if (bookedDates.includes(formattedDate)) return "booked-date"; // Style booked dates

        return "";
      }}
    />
  );
};

export default BookingCalendar;
