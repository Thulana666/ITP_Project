import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminGenerateReport = () => {
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure the token is included
      if (!token) {
        alert("Unauthorized. Please log in again.");
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/admin/generate-report", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "user_report.pdf");
        document.body.appendChild(link);
        link.click();
      } else {
        console.error("Failed to generate report:", response.statusText);
        alert("Error generating report. Please try again.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Server error while generating report.");
    }
  };

  // Inline CSS styles
  const pageStyle = {
    width: "100%",
    padding: "40px",
    backgroundColor: "#f4f6f9",
    fontFamily: "'Arial', sans-serif",
  };

  const headerStyle = {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  };

  const buttonStyle = {
    padding: "12px 24px",
    backgroundColor: "#1abc9c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, transform 0.2s",
  };

  const buttonHoverStyle = {
    backgroundColor: "#16a085",
    transform: "translateY(-2px)",
  };

  return (
    <div style={pageStyle}>
      <h2 style={headerStyle}>Generate User Report</h2>
      <button
        onClick={handleGenerateReport}
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
      >
        Download Report
      </button>
    </div>
  );
};

export default AdminGenerateReport;
