import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';

const BookingReportPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('eventType');

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

    // Title and date sections
    doc.setFontSize(20);
    doc.text('Booking Report', margin, yPos);
    yPos += lineHeight * 2;

    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
    yPos += lineHeight * 2;

    // Bookings with package details
    bookings.forEach((booking, index) => {
      // Check page space
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text(`Booking #${index + 1}`, margin, yPos);
      yPos += lineHeight;

      doc.setFontSize(12);
      const details = [
        `Event Type: ${booking.eventType}`,
        `Date: ${new Date(booking.eventDate).toLocaleDateString()}`,
        `Expected Crowd: ${booking.expectedCrowd}`,
        `Services: ${booking.salonServices?.join(', ') || 'None'}`
      ];

      // Add package details if available
      if (booking.packages && booking.packages.length > 0) {
        details.push('\nSelected Packages:');
        booking.packages.forEach(pkg => {
          details.push(
            `  • ${pkg.serviceType} - ${pkg.packageName}`,
            `    Price: Rs. ${pkg.price}`
          );
        });
        details.push(`\nTotal Price: Rs. ${booking.totalPrice || 'N/A'}`);
      }

      details.push('------------------------');

      details.forEach(line => {
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

  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;
    
    switch (searchCategory) {
      case 'eventType':
        return booking.eventType.toLowerCase().includes(searchTerm.toLowerCase());
      case 'date':
        return new Date(booking.eventDate).toLocaleDateString().includes(searchTerm);
      case 'crowd':
        return booking.expectedCrowd.toString().includes(searchTerm);
      case 'packages':
        return booking.packages?.some(pkg => 
          pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'price':
        return booking.totalPrice?.toString().includes(searchTerm);
      default:
        return true;
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Booking Report</h2>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <select 
              className="form-select" 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="eventType">Event Type</option>
              <option value="date">Date</option>
              <option value="crowd">Crowd Size</option>
              <option value="packages">Packages</option>
              <option value="price">Price</option>
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <button 
            onClick={generatePDF}
            className="btn btn-primary"
          >
            Generate PDF Report
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Event Type</th>
            <th>Date</th>
            <th>Expected Crowd</th>
            <th>Packages</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.eventType}</td>
              <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
              <td>{booking.expectedCrowd}</td>
              <td>
                {booking.packages?.length > 0 
                  ? booking.packages.map(pkg => 
                      `${pkg.packageName} (${pkg.serviceType})`
                    ).join(', ')
                  : 'No packages'}
              </td>
              <td>{booking.totalPrice ? `Rs. ${booking.totalPrice}` : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingReportPage;
