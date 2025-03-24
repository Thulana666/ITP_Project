// src/components/common/Navbar.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  // Don't show navbar on the dashboard
  if (location.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">Event Management</Link>
        </div>
        
        <div className="navbar-menu">
          <ul className="navbar-nav">
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">Home</Link>
            </li>
            <li className={location.pathname === '/packages' ? 'active' : ''}>
              <Link to="/packages">Services</Link>
            </li>
            {currentUser && currentUser.role === 'service_provider' && (
              <li className={location.pathname === '/dashboard' ? 'active' : ''}>
                <Link to="/dashboard">Provider Dashboard</Link>
              </li>
            )}
          </ul>
        </div>
        
        <div className="navbar-auth">
          {currentUser ? (
            <div className="user-menu">
              <span className="user-name">{currentUser.fullName}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                Service Provider Login
              </Link>
              <Link to="/register" className="btn-register">
                Register as Provider
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;