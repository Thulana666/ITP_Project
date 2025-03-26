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

  // Don't show navbar on dashboard pages
  if (['/dashboard', '/admin', '/customer-dashboard'].includes(location.pathname)) {
    return null;
  }

  const getDashboardLink = () => {
    switch (currentUser?.role) {
      case 'service_provider':
        return '/service-provider/dashboard';
      case 'admin':
        return '/admin';
      case 'customer':
        return '/customer-dashboard';
      default:
        return '/';
    }
  };

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
          </ul>
        </div>
        
        <div className="navbar-auth">
          {currentUser ? (
            <div className="user-menu">
              <span className="user-name">{currentUser.fullName}</span>
              <Link to={getDashboardLink()} className="btn-dashboard">
                Dashboard
              </Link>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;