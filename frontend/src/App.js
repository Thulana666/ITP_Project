import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PaymentPage from "./pages/PaymentPage";
import ViewPaymentsPage from "./pages/ViewPaymentsPage";
import PaymentReportPage from "./pages/PaymentReportPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h2>Wedding Planning Payments</h2>
          <ul>
            <li>
              <Link to="/">Payment Form</Link>
            </li>
            <li>
              <Link to="/view-payments">View Payments</Link>
            </li>
            <li>
              <Link to="/payment-report">Payment Report</Link>
            </li>
          </ul> {/* Closing ul tag */}
        </nav> {/* Closing nav tag */}
        
        <Routes>
          <Route path="/" element={<PaymentPage />} />
          <Route path="/view-payments" element={<ViewPaymentsPage />} />
          <Route path="/payment-report" element={<PaymentReportPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
