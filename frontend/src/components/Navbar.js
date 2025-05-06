import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // This will now handle both state clearing and navigation
  };

  // Update effect dependencies to include logout
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && currentUser) {
      logout();
    }
  }, [currentUser, logout]); // Add proper dependencies

  const getDashboardLink = () => {
    switch (currentUser?.role) {
      case "service_provider":
        return "/service-provider/dashboard";
      case "admin":
        return "/admin";
      case "customer":
        return "/customer-dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Brand Logo" className="logo-img" width={50}/>
        </Link>
        <Link to="/"> <p>Ruchira Liyanagamage<br></br> Bridal Salon</p></Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/packages">Packages</Link>
        <Link to="/booking">Bookings</Link>
        <Link to="/reviews">Reviews</Link>
      </div>
      <div className="nav-buttons">
        {currentUser ? (
          <>
            <Link to={getDashboardLink()}><button className="dashboard-btn">My Profile</button></Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/login'><button className="login-btn">Login</button></Link>
            <Link to='/register'><button className="signup-btn">Sign Up</button></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
