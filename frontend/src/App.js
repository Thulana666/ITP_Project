import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import ManageBookingsPage from "./pages/ManageBookingsPage";
import EditBookingPage from "./pages/EditBookingPage";
import BookingDetails from "./components/BookingDetails";
import PaymentPage from "./pages/PaymentPage";
import ViewPaymentsPage from "./pages/ViewPaymentsPage";
import PaymentReportPage from "./pages/PaymentReportPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/manage-bookings" element={<ManageBookingsPage />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route path="/edit-booking/:id" element={<EditBookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/view-payments" element={<ViewPaymentsPage />} />
          <Route path="/payment-report" element={<PaymentReportPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;