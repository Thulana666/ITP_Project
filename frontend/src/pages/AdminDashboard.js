import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminViewUsers from "./admin/AdminViewUsers";
import AdminApproveServiceProviders from "./admin/AdminApproveServiceProviders";
import AdminUpdateUserRole from "./admin/AdminUpdateUserRole";
import AdminDeleteUser from "./admin/AdminDeleteUser";
import AdminGenerateReport from "./admin/AdminGenerateReport";

const AdminDashboard = () => {
  const adminDashboardStyle = {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  };

  const adminContentStyle = {
    flexGrow: 1,
    padding: "20px",
    backgroundColor: "#fff",
    overflowY: "auto",
  };

  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#2c3e50",
    padding: "20px",
    color: "#fff",
    fontSize: "18px",
    boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)",
  };

  const sidebarHeadingStyle = {
    color: "#ecf0f1",
    marginBottom: "20px",
  };

  const sidebarLinkStyle = {
    color: "#bdc3c7",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "color 0.3s ease-in-out",
  };

  const sidebarLinkHoverStyle = {
    color: "#16a085",
  };

  const pageHeadingStyle = {
    color: "#2c3e50",
    fontSize: "24px",
    marginBottom: "20px",
  };

  const listStyle = {
    padding: "0",
    listStyle: "none",
  };

  const listItemStyle = {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out",
  };

  const listItemHoverStyle = {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
  };

  const buttonStyle = {
    padding: "8px 15px",
    border: "none",
    backgroundColor: "#16a085",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#1abc9c",
  };

  const buttonDisabledStyle = {
    backgroundColor: "#bdc3c7",
    cursor: "not-allowed",
  };

  const errorTextStyle = {
    fontSize: "18px",
    color: "#e74c3c",
    textAlign: "center",
    fontWeight: "bold",
  };

  const loadingTextStyle = {
    fontSize: "18px",
    color: "#7f8c8d",
    textAlign: "center",
  };

  return (
    <div style={adminDashboardStyle}>
      <AdminSidebar />
      <div style={adminContentStyle}>
        <h2 style={pageHeadingStyle}>Admin Dashboard</h2>
        <Routes>
          <Route path="view-users" element={<AdminViewUsers />} />
          <Route path="approve-service-providers" element={<AdminApproveServiceProviders />} />
          <Route path="update-user-role" element={<AdminUpdateUserRole />} />
          <Route path="delete-user" element={<AdminDeleteUser />} />
          <Route path="generate-report" element={<AdminGenerateReport />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
