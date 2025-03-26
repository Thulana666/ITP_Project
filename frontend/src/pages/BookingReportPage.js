import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';

const BookingReportPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings/all');
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 10;
    const margin = 20;

    // Title
    doc.setFontSize(20);
    doc.text('Booking Report', margin, yPos);
    yPos += lineHeight * 2;

    // Date
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
    yPos += lineHeight * 2;

    // Bookings
    bookings.forEach((booking, index) => {
      doc.setFontSize(14);
      doc.text(`Booking #${index + 1}`, margin, yPos);
      yPos += lineHeight;

      doc.setFontSize(12);
      const details = [
        `Event Type: ${booking.eventType}`,
        `Date: ${new Date(booking.eventDate).toLocaleDateString()}`,
        `Expected Crowd: ${booking.expectedCrowd}`,
        `Total Price: ${booking.totalPrice || 'N/A'}`,
        `Services: ${booking.salonServices?.join(', ') || 'None'}`,
        '------------------------'
      ];

      details.forEach(line => {
        // Add new page if content exceeds page height
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, margin, yPos);
        yPos += lineHeight;
      });
      yPos += lineHeight/2;
    });

    doc.save(`bookings-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Booking Report</h2>
      <button 
        onClick={generatePDF}
        className="btn btn-primary mb-3"
      >
        Generate PDF Report
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Event Type</th>
            <th>Date</th>
            <th>Expected Crowd</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.eventType}</td>
              <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
              <td>{booking.expectedCrowd}</td>
              <td>{booking.totalPrice || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingReportPage;
