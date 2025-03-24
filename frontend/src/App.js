import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import ManageBookingsPage from "./pages/ManageBookingsPage";
import EditBookingPage from "./pages/EditBookingPage";
import BookingDetails from "./components/BookingDetails";

function App() {
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
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
