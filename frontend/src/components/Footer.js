import React from "react";
import "../styles/Footer.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footerc">
      <div className="footerWrapper">
        <div className="c1">
          <Link to="/">
            <img src={logo} alt="Brand Logo" className="logo-img" width={100} />
          </Link>
          <Link to="/">
            {" "}
            <p className="name">
              Ruchira Liyanagamage<br></br> Bridal Salon
            </p>
          </Link>
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-right">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            &nbsp;&nbsp;Home
          </a>
          <a href="/packages">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-right">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            &nbsp;&nbsp;Packages
          </a>
          <a href="/booking">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-right">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            &nbsp;&nbsp;Bookings
          </a>
          <a href="/reviews">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-right">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            &nbsp;&nbsp;Reviews
          </a>
        </div>
        <div className="footer-links">
          <h3>Contact Us</h3>

          <a href="https://wa.me/94716026309">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-phone-call">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              <path d="M14.05 2a9 9 0 0 1 8 7.94" />
              <path d="M14.05 6A5 5 0 0 1 18 10" />
            </svg>
            &nbsp;&nbsp;&nbsp;+94 71 602 6309
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=salonruchira.info@gmail.com"
            target="_blank"
            rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-mail">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            &nbsp;&nbsp;&nbsp;salonruchira.info@gmail.com
          </a>
          <a href="https://maps.app.goo.gl/pV8DniXuvusFT3Eu9">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-map-pinned">
              <path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0" />
              <circle cx="12" cy="8" r="2" />
              <path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712" />
            </svg>
            &nbsp;&nbsp;&nbsp;306/3, Kaduwela Road
          </a>
          <br></br>
          
        </div>
      </div>
      <hr></hr>
      <br></br>
      
      <p>&copy; 2025 Ruchira Liyanagamage Bridal Salon, All Rights Reserved</p>
      <div className="socialMedia">
      <a
            href="https://www.facebook.com/salonruchirabridle/"
            target="_blank"
            rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-facebook">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            &nbsp;Facebook
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a
            href="https://www.instagram.com/ruchiraliyanagamage_brides/"
            target="_blank"
            rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-instagram">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            &nbsp;Instagram
          </a>
          </div>
          <br></br>
    </footer>
  );
};

export default Footer;
