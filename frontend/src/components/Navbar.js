import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/logo.png"; // Import your logo image

const Navbar = () => {
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
        <button className="login-btn">Login </button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
