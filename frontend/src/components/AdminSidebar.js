import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2 style={{color: "#fda92d"}}>Admin Dashboard</h2>
      <ul>
        <li style={{ 
  backgroundColor: '#fda92d',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#000'
}} ><Link to="/admin/view-users">View & Search Users</Link></li>
        <li style={{ 
  backgroundColor: '#fda92d',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#000'
}}  ><Link to="/booking-report">Search Bookings</Link></li>
        <li style={{ 
  backgroundColor: '#fda92d',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#000'
}} ><Link to="/admin/approve-service-providers">Approve Service Providers</Link></li>
        <li style={{ 
  backgroundColor: '#fda92d',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#000'
}} ><Link to="/admin/generate-report">Generate Report</Link></li>
        <li style={{ 
  backgroundColor: '#fda92d',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '5px',
  textAlign: 'center', 
  color: '#000'
}} ><Link to="/view-payments">View Payments</Link></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
