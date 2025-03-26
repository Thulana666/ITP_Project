import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';
import HomePage from './pages/HomePage';
import Register from './pages/Register'; 
import Login from "./pages/Login";
import ServiceProviderDashboard from './components/ServiceProviderDashboard'; // Correct path
import AdminDashboard from './pages/AdminDashboard'; // Correct path
import CustomerDashboard from './components/CustomerDashboard'; // Import the CustomerDashboard component
import './styles/Register.css';
import './styles/Dashboard.css';
import './styles/AdminApproveServiceProviders.css';
import './styles/AdminDashboard.css'; // Import Admin Dashboard styles

import BookingPage from "./pages/BookingPage";
import ManageBookingsPage from "./pages/ManageBookingsPage";
import EditBookingPage from "./pages/EditBookingPage";
import BookingDetails from "./components/BookingDetails";

import ServiceSelectionPage from './pages/ServiceSelectionPage';
//import PackageListPage from './pages/PackageManagement';

import PaymentPage from "./pages/PaymentPage";
import ViewPaymentsPage from "./pages/ViewPaymentsPage";
import PaymentReportPage from "./pages/PaymentReportPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/service-provider/dashboard" element={<ServiceProviderDashboard />} /> {/* Add the dashboard route */}
          <Route path="/admin/*" element={<AdminDashboard />} /> {/* Admin Dashboard Route */}
          <Route path="/customer-dashboard" element={<CustomerDashboard />} /> {/* Customer Dashboard Route */}
          
          {/* Booking Routes */}
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/manage-bookings" element={<ManageBookingsPage />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route path="/edit-booking/:id" element={<EditBookingPage />} />

          <Route path="/packages" element={<ServiceSelectionPage />} />  
          {/*<Route path="/package-management" element={<PackageListPage />} />   */}
          {/* Payment Routes */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/view-payments" element={<ViewPaymentsPage />} />
          <Route path="/payment-report" element={<PaymentReportPage />} />

        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
