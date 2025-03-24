import React from "react";
import PaymentReport from "../components/PaymentReportChart.js";
import "../styles/PaymentReportPage.css";

const PaymentReportPage = () => {
  return (
    <div className="report-container">
      <h2>Monthly Payment Report</h2>
      <PaymentReport />
    </div>
  );
};

export default PaymentReportPage;
