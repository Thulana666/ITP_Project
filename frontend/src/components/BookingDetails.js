import React, { useEffect, useState } from "react";
import { getBookingById } from "../services/bookingService";
import { useParams } from "react-router-dom";
import "../styles/BookingDetails.css";

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const data = await getBookingById(id);
      setBooking(data);
    };
    fetchBooking();
  }, [id]);

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div clalssName="booking-details-wrapper">
      <h2>Booking Details</h2>
    <div className="booking-details-container">
      <p><strong>Event Type :</strong> {booking.eventType}</p>
      <p><strong>Event Date :</strong> {booking.eventDate}</p>
      <p><strong>Expected Crowd :</strong> {booking.expectedCrowd}</p>
      <p><strong>Salon Services :</strong> {booking.salonServices.join(", ")}</p>
    </div>
    </div>
  );
};

export default BookingDetails;
