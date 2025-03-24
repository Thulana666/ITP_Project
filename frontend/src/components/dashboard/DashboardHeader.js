// src/components/dashboard/DashboardHeader.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const DashboardHeader = ({ user, serviceType }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-brand">
          <h1>Service Provider Dashboard</h1>
          <span className="service-type">{serviceType}</span>
        </div>
        
        <div className="header-nav">
          <nav>
            <ul>
              <li>
                <Link to="/dashboard" className="active">Dashboard</Link>
              </li>
              <li>
                <Link to="/packages">View All Packages</Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="header-profile">
          <div className="profile-info">
            <span className="user-name">{user?.fullName}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;