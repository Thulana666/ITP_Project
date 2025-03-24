// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary-SP';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import ServiceSelectionPage from './pages/ServiceSelectionPage';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard';
import BookingPage from "./pages/BookingPage";
import ManageBookingsPage from "./pages/ManageBookingsPage";
import EditBookingPage from "./pages/EditBookingPage";
import BookingDetails from "./components/BookingDetails";
import PaymentPage from "./pages/PaymentPage";
import ViewPaymentsPage from "./pages/ViewPaymentsPage";
import PaymentReportPage from "./pages/PaymentReportPage";

// Auth Components
import Login from './components/auth/Login-SP';
import Register from './components/auth/Register-SP';
import EmailVerification from './components/auth/EmailVerification-SP';

// Import CSS
import './App.css';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Navbar />
          <div className="content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/packages" element={<ServiceSelectionPage />} />
              <Route path="/login-sp" element={<Login />} />
              <Route path="/register-sp" element={<Register />} />
              <Route path="/verify-email-sp" element={<EmailVerification />} />
              
              {/* Booking Routes */}
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/manage-bookings" element={<ManageBookingsPage />} />
              <Route path="/booking/:id" element={<BookingDetails />} />
              <Route path="/edit-booking/:id" element={<EditBookingPage />} />
              
              {/* Payment Routes */}
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/view-payments" element={<ViewPaymentsPage />} />
              <Route path="/payment-report" element={<PaymentReportPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard-sp" 
                element={
                  <ProtectedRoute allowedRoles={['service_provider']}>
                    <ServiceProviderDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;