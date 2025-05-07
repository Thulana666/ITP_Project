import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/ProfileView.css";
import { useNavigate } from 'react-router-dom';

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/service-provider/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(" Fetched Profile Data:", response.data);
        setProfile(response.data);
      } catch (err) {
        console.error(" Error fetching profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {/* Add this button before viewProfile */}
      <center>
      <button 
          onClick={() => navigate('/service-provider/notifications')}
          style={{
            backgroundColor: '#2C3F50',
            color: 'white',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
            width: '400px'
            
          }}
        >
          Notifications
        </button></center>
      <h2>My Profile</h2>
      <img 
        src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png" 
        alt="User Profile" 
        style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
      />
      <p><strong>Name:</strong> {profile.fullName}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phoneNumber}</p>
      <p><strong>Service Type:</strong> {profile.serviceType}</p>

      <button onClick={() => navigate('/add-package')} id='add-manage-package-button'>
          Add Package
        </button><br></br>
        <button onClick={() => navigate('/service-provider/packages')} id='add-manage-package-button'>
          Manage Packages
        </button>
    </div>
  );
};

export default ProfileView;
