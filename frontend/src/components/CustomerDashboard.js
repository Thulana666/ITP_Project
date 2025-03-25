import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import AddReview from './AddReview'; // Update the path based on where the AddReview component is located


const CustomerDashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ fullName: "", email: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [activeSection, setActiveSection] = useState("profile");
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchCustomerProfile();
    }
  }, [navigate]);

  const fetchCustomerProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/customer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomer(response.data);
      setUpdatedProfile({ fullName: response.data.fullName, email: response.data.email });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/customer/profile", updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      fetchCustomerProfile();
      setActiveSection("profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/customer/change-password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Password updated successfully!");
      setChangePasswordMode(false);
      setPasswords({ currentPassword: "", newPassword: "" });
      setActiveSection("profile");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/customer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (!customer) return <p>Loading...</p>;

  // Inline CSS styles
  const dashboardStyle = {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f0f4f8",
    fontFamily: "'Arial', sans-serif",
  };

  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#2c3e50",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
  };

  const contentStyle = {
    flex: 1,
    padding: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const sectionBoxStyle = {
    width: "400px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    fontSize: "16px",
    backgroundColor: "#34495e",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#16a085",
  };

  return (
    <div style={dashboardStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2>Dashboard</h2>
        <button
          style={activeSection === "profile" ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveSection("profile")}
        >
          View Profile
        </button>
        <button
          style={activeSection === "editProfile" ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveSection("editProfile")}
        >
          Edit Profile
        </button>
        <button
          style={activeSection === "changePassword" ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveSection("changePassword")}
        >
          Change Password
        </button>
        <button
          style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
          onClick={handleDelete}
        >
          Delete Account
        </button>

        <button
          style={activeSection === "addReview" ? activeButtonStyle : buttonStyle}  // Set active button style conditionally
          onClick={() => setActiveSection("addReview")}  // Set "addReview" as active section on button click
        >
          Add Review
        </button>  

      </div>

      {/* Content Area */}
      <div style={contentStyle}>
        <div style={sectionBoxStyle}>
          {activeSection === "profile" && (
            <>
              <h3>Customer Profile</h3>
              
              <img 
                src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png" 
                alt="User Profile" 
                style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
              />
              <p><strong>Name:</strong> {customer.fullName}</p>
              <p><strong>Email:</strong> {customer.email}</p>
            </>
          )}

          {activeSection === "editProfile" && (
            <>
              <h3>Edit Profile</h3>
              <label>Full Name:</label>
              <input
                type="text"
                value={updatedProfile.fullName}
                onChange={(e) => setUpdatedProfile({ ...updatedProfile, fullName: e.target.value })}
                style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px" }}
              />
              <label>Email:</label>
              <input
                type="email"
                value={updatedProfile.email}
                onChange={(e) => setUpdatedProfile({ ...updatedProfile, email: e.target.value })}
                style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px" }}
              />
              <button style={buttonStyle} onClick={handleUpdate}>Save</button>
            </>
          )}

          {activeSection === "changePassword" && (
            <>
              <h3>Change Password</h3>
              <label>Current Password:</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px" }}
              />
              <label>New Password:</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px" }}
              />
              <button style={buttonStyle} onClick={handleChangePassword}>Change Password</button>
            </>
          )}


          {activeSection === "addReview" && (
            <>
              <h3>Add Review</h3>
              {/* AddReview component goes here */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
