import React from "react";
import "../styles/Home.css";
import brideImage from "../assets/bride.png";
import salonImage from "../assets/salon.jpg";
import s1 from "../assets/s1.png";
import s2 from "../assets/s2.png";
import s3 from "../assets/s3.png";
import s4 from "../assets/s4.png";
import event from "../assets/event.jpg";

const HomePage = () => {
  return (
    <div className="container">
      <div className="content-wrapper">
        <section className="sec1">
          <div className="homepage">
            <div className="hero">
              <div className="hero-text">
                <h1>
                  Transform Your Life's Biggest Moments With Our Expert Styling
                  Services
                </h1>
                <p>
                  Discover personalized styling solutions tailored to make your
                  special moments unforgettable. From weddings to professional
                  photoshoots, we bring your vision to life with expert care and
                  creativity.
                </p>
                <a href="/booking">
                  <button className="plan-btn">
                    Book An Event &nbsp;&nbsp;{" "}
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
                  </button>
                </a>
              </div>
              <div className="hero-image">
                <img src={brideImage} alt="Bride" height={690} />
              </div>
            </div>
          </div>
        </section>

        <div className="mainsec">

        <section className="sec2">
          <div className="aboutus">
            <h2>About Us</h2>
            <div className="aboutus-text">
              <img src={salonImage} alt="salon" height={500} />
              <p>
                <p
                  style={{
                    fontFamily: "judson",
                    fontSize: "40px",
                    lineHeight: "50px",
                  }}>
                  Our Journey In <br></br>Salon Industry
                </p>
                At Ruchira Liyanagamage Brides, we believe <br></br>
                beauty is an art. Our team of skilled professionals <br></br>
                is dedicated to providing the highest quality hair, <br></br>
                makeup, and skincare services to help you look and <br></br>
                feel your best.<br></br>
                <br></br>
                With years of experience, premium products, <br></br>
                and personalized care, we ensure every client leaves <br></br>
                with confidence and satisfaction.
              </p>
            </div>
          </div>
        </section>
        <section className="sec3">
          <img src={s1} alt="salon" height={100} />
          <img src={s2} alt="salon" height={100} />
          <img src={s3} alt="salon" height={100} />
          <img src={s4} alt="salon" height={100} />
        </section>
        <section className="sec4">
          <div className="services">
            <h2>Our Services</h2>
            <div className="cards">
              <div className="card1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-scissors">
                  <circle cx="6" cy="6" r="3" />
                  <path d="M8.12 8.12 12 12" />
                  <path d="M20 4 8.12 15.88" />
                  <circle cx="6" cy="18" r="3" />
                  <path d="M14.8 14.8 20 20" />
                </svg>
                <h1>Hair Styling</h1>
                <p>
                  Transform your look with expert cuts, colors, and styles
                  tailored just for you!
                </p>
              </div>
              <div className="card1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-eye-closed">
                  <path d="m15 18-.722-3.25" />
                  <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                  <path d="m20 15-1.726-2.05" />
                  <path d="m4 15 1.726-2.05" />
                  <path d="m9 18 .722-3.25" />
                </svg>
                <h1>Makeup</h1>
                <p>
                  Flawless makeup for every occasion enhancing your natural beauty
                  with perfection!
                </p>
              </div>
              <div className="card1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-shirt">
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                </svg>
                <h1>Dressing</h1>
                <p>
                  Elegance meets style! Find the perfect outfit to shine on your
                  special day.
                </p>
              </div>
              <div className="card1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-camera">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <h1>Photographers</h1>
                <p>
                  Easily find the best photographers to capture every special
                  moment beautifully!
                </p>
              </div>
              <div className="card1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-hotel">
                  <path d="M10 22v-6.57" />
                  <path d="M12 11h.01" />
                  <path d="M12 7h.01" />
                  <path d="M14 15.43V22" />
                  <path d="M15 16a5 5 0 0 0-6 0" />
                  <path d="M16 11h.01" />
                  <path d="M16 7h.01" />
                  <path d="M8 11h.01" />
                  <path d="M8 7h.01" />
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                </svg>
                <h1>Hotels</h1>
                <p>
                  Discover top rated hotels that offer comfort and luxury for your
                  event.
                </p>
              </div>
              <div className="card1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-guitar">
                  <path d="m11.9 12.1 4.514-4.514" />
                  <path d="M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z" />
                  <path d="m6 16 2 2" />
                  <path d="M8.2 9.9C8.7 8.8 9.8 8 11 8c2.8 0 5 2.2 5 5 0 1.2-.8 2.3-1.9 2.8l-.9.4A2 2 0 0 0 12 18a4 4 0 0 1-4 4c-3.3 0-6-2.7-6-6a4 4 0 0 1 4-4 2 2 0 0 0 1.8-1.2z" />
                  <circle cx="11.5" cy="12.5" r=".5" fill="currentColor" />
                </svg>
                <h1>Music Bands</h1>
                <p>
                  Set the perfect vibe with talented music bands for an
                  unforgettable experience!
                </p>
              </div>
            </div>
          </div>
          <h1 className="discountH1">Special Offers & Discount</h1>
          <img className="eventimg" src={event} alt="event" height={500} />
          <br></br><br></br>
          <h2>⭐️⭐️⭐️⭐️⭐️</h2>
        </section>
        <section className="sec5">
          <div className="services">
          
            <h2>
              Transform Your Life's Biggest Moments<br></br> With Our Services
            </h2>
            <p>
              Discover personalized styling solutions tailored to make your
              special moments unforgettable. <br></br>
              From weddings to professional photoshoots, we bring your vision to
              life<br></br>
              with expert care and creativity.
            </p>
            <a href="/booking">
              <button
                className="plan-btn"
                style={{ backgroundColor: "#12131A", color: "#fcfaf8" }}>
                Book An Event &nbsp;&nbsp;{" "}
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
              </button>
              
            </a>
            
          </div>
          
        </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
