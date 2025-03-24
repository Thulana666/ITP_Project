// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary-SP';
import ProtectedRoute from './components/common/ProtectedRoute';
import ServiceSelectionPage from './pages/ServiceSelectionPage';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard';
import Login from './components/auth/Login-SP';
import Register from './components/auth/Register-SP';
import EmailVerification from './components/auth/EmailVerification-SP';
import Navbar from './components/common/Navbar';

// Import CSS
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<ServiceSelectionPage />} />
              <Route path="/login-sp" element={<Login />} />
              <Route path="/register-sp" element={<Register />} />
              <Route path="/verify-email-sp" element={<EmailVerification />} />
              <Route path="/packages" element={<ServiceSelectionPage />} />
              
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
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;