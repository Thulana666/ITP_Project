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

import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthContextProvider } from './context/AuthContext';
import PackageForm from './components/PackageForm';
import PackageList from './components/PackageList';
import BookingReportPage from "./pages/BookingReportPage";

import ReviewListPage from "./pages/ReviewListPage";
import ReviewPage from "./pages/ReviewPage";
import ReviewReportPage from "./pages/ReviewReportPage";
import ServiceProviderPackages from './pages/ServiceProviderPackages';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route 
              path="/service-provider/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  <ServiceProviderDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/customer-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Booking Routes */}
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/manage-bookings" element={<ManageBookingsPage />} />
            <Route path="/booking/:id" element={<BookingDetails />} />
            <Route path="/edit-booking/:id" element={<EditBookingPage />} />

            <Route 
              path="/service-provider/packages" 
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  <ServiceProviderPackages />
                </ProtectedRoute>
              } 
            />
            <Route path="/packages" element={<ServiceSelectionPage />} />  
            <Route path="/add-package" element={<PackageForm />} />
            <Route path="/package-list" element={<PackageList />} />
            
            {/* Payment Routes */}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/view-payments" element={<ViewPaymentsPage />} />
            <Route path="/payment-report" element={<PaymentReportPage />} />
            <Route path="/booking-report" element={<BookingReportPage />} />

            {/* Review Routes */}
            <Route path="/add-review" element={<ReviewPage />} />
            <Route path="/reviews" element={<ReviewListPage />} />
            <Route path="/review-report" element={<ReviewReportPage />} />

          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
