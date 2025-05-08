import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProfileUpdate.css'; // Add this import

const ProfileUpdate = () => {
  // Initialize form data state with password field
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    serviceType: '',
    password: '', // Adding password field
  });

  // Load the service provider profile data when component mounts
  useEffect(() => {
    // Make a GET request to fetch the profile details
    axios
      .get('/api/service-provider/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        // Populate form data with fetched data
        setFormData({
          fullName: response.data.fullName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          serviceType: response.data.serviceType,
          password: '', // Ensure password is not pre-filled
        });
      })
      .catch((error) => console.error('Error fetching profile:', error));
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for updating profile
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Make a PUT request to update the profile
    axios
      .put(
        '/api/service-provider/profile',
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then((response) => {
        alert('Profile updated successfully!');
  
        // Optionally re-fetch the profile to get the latest data (if necessary)
        axios
          .get('/api/service-provider/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
          .then((response) => {
            setFormData({
              fullName: response.data.fullName,
              email: response.data.email,
              phoneNumber: response.data.phoneNumber,
              serviceType: response.data.serviceType,
              password: '', // Reset password field
            });
          })
          .catch((error) => console.error('Error fetching profile:', error));
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        alert('Error updating profile.');
      });
  };
  

  return (
    <div className="profile-update-container">
      <div className="profile-update-content">
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              disabled // Disable since email should not be changed
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>

          <div className="form-group">
            <label>Service Type</label>
            <input
              type="text"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              placeholder="Service Type"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password (leave blank if not changing)"
            />
          </div>

          <button type="submit" className="submit-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;
