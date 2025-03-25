import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register'; 
import Login from "./pages/Login";
import ServiceProviderDashboard from './components/ServiceProviderDashboard'; // Correct path
import AdminDashboard from './pages/AdminDashboard'; // Correct path
import CustomerDashboard from './components/CustomerDashboard'; // Import the CustomerDashboard component
import './styles/Register.css';
import './styles/Dashboard.css';
import './styles/AdminApproveServiceProviders.css';
import './styles/AdminDashboard.css'; // Import Admin Dashboard styles

function App() {
  return (
    <Router>
      <div className="app-container">
        
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/service-provider/dashboard" element={<ServiceProviderDashboard />} /> {/* Add the dashboard route */}
          <Route path="/admin/*" element={<AdminDashboard />} /> {/* Admin Dashboard Route */}
          <Route path="/customer-dashboard" element={<CustomerDashboard />} /> {/* Customer Dashboard Route */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
