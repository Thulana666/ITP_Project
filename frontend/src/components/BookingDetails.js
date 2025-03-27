import React, { useEffect, useState } from "react";
import { getBookingById } from "../services/bookingService";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/BookingDetails.css";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
//fetching booking details
  useEffect(() => {
    const fetchBooking = async () => {
      const data = await getBookingById(id);
      console.log(data);
      setBooking(data);
    };
    fetchBooking();
  }, [id]);

  const handleCheckout = () => {
    navigate('/payment', {
      state: {
        bookingId: booking._id,
        totalPrice: booking.totalPrice,
        selectedPackages: booking.packages
      }
    });
  };

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div className="booking-details-wrapper">
      <h2>Booking Details</h2>
      <div className="booking-details-container">
        <p><strong>Event Type :</strong> {booking.eventType}</p>
        <p><strong>Event Date :</strong> {booking.eventDate}</p>
        <p><strong>Expected Crowd :</strong> {booking.expectedCrowd}</p>
        <p><strong>Salon Services :</strong> {booking.salonServices.join(", ")}</p>
      </div>
      <h2>Package Details</h2>
      <div className="booking-details-container">
        {booking.packages.map((pkg, index) => (
          <div key={pkg._id} className="package-item">
            <p><strong>Service Type:</strong> {pkg.serviceType}</p>
            <p><strong>Package Name:</strong> {pkg.packageName}</p>
            <p><strong>Price:</strong> Rs. {pkg.price}</p>
          </div>
        ))}
        <div className="total-price">
          <p><strong>Total Price:</strong> Rs. {booking.totalPrice}</p>
          <button className="globalButton" onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
