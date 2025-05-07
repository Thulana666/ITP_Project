import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2 style={{color: "#fda92d"}}>Admin Dashboard</h2>
      <ul>
        <li><Link to="/admin/view-users">View & Search Users</Link></li>
        <li><Link to="/admin/approve-service-providers">Approve Service Providers</Link></li>
        <li><Link to="/admin/generate-report">Generate Report</Link></li>
        <li><Link to="/view-payments">View Payments</Link></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
